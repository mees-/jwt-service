import { Router, RequestHandler } from "express"
import Keyv from "keyv"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { merge } from "merge-anything"
import { secret, audience, issuer, connectionString } from "./config"

const SALT_ROUNDS = 10

enum Role {
	Create = "CREATE",
	Read = "READ",
	Update = "UPDATE",
	Delete = "DELETE",
}

type User = {
	id: string
	data: any
	roles: Role[]
}

type UserWithHash = User & {
	hash: string
}

type UserWithPassword = User & {
	password: string
}

const users = new Keyv<UserWithHash>(connectionString, {
	namespace: "user",
})
export const getUser = users.get.bind(users)

const userRouter = Router()

declare global {
	namespace Express {
		interface Request {
			user: User
		}
	}
}
userRouter.use("/user", async (req, res, next) => {
	const authHeader = req.get("Authorization")
	if (authHeader != null && authHeader.startsWith("Bearer")) {
		const token = authHeader.split(" ")[1]
		try {
			const decoded = jwt.verify(token, secret, {
				issuer,
				audience,
			})
			req.user = decoded as User
			next()
		} catch (e) {
			res.status(401)
			res.set("WWW-Authenticate", "Bearer")
			res.end()
		}
	}
})

const checkRoles = (roles: Role[] | Role): RequestHandler => async (
	req,
	res,
	next,
) => {
	if (!Array.isArray(roles)) {
		roles = [roles]
	}
	if (roles.every((role) => req.user.roles.includes(role))) {
		next()
	} else {
		res.status(403)
		res.end()
	}
}

const checkContentType = (type: string): RequestHandler => (req, res, next) => {
	if (req.get("Content-Type") === type) {
		next()
	} else {
		res.status(415)
		res.end()
	}
}

userRouter.post(
	"/:id",
	checkContentType("application/json"),
	checkRoles(Role.Create),
	async (req, res) => {
		const { id } = req.params
		const { password, roles, data } = req.body as UserWithPassword
		if (id == null || password == null) {
			res.status(415)
			res.end()
		} else if (await users.get(id)) {
			res.status(403)
			res.send("Error: cannot create user")
		} else {
			const hash = await bcrypt.hash(password, SALT_ROUNDS)
			const user: UserWithHash = {
				id,
				hash,
				data: data ?? {},
				roles: roles ?? [],
			}
			await users.set(id, user)
			res.status(200)
			res.send({ ...user, hash: undefined })
		}
	},
)

userRouter.get("/:id", checkRoles(Role.Read), async (req, res) => {
	const user = await users.get(req.params.id)
	if (user != null) {
		res.status(200)
		delete user.hash
		res.json(user)
	} else {
		res.status(404)
		res.end()
	}
})

userRouter.put(
	"/:id",
	checkContentType("application/json"),
	checkRoles(Role.Update),
	async (req, res) => {
		const user = await users.get(req.params.id)
		if (user != null) {
			user.data = merge(user.data, req.body)
			await users.set(req.params.username, user)
			res.status(200)
			res.end()
		}
	},
)

userRouter.delete("/:id", checkRoles(Role.Delete), async (req, res) => {
	const deleted = users.delete(req.params.id)
	if (deleted != null) {
		res.status(200)
		res.end()
	} else {
		res.status(404)
		res.end()
	}
})

export default userRouter
