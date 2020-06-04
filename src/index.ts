import express, { RequestHandler } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import bodyParser from "body-parser"
import morgan from "morgan"
import { secret, issuer, audience, expiresIn, port } from "./config"

import userRouter, { getUser } from "./user"

const app = express()

app.use(morgan(process.env.NODE_ENV === "developlent" ? "dev" : "tiny"))

app.use(bodyParser.json())
app.use(bodyParser.text({ type: "application/jwt" }))

app.use("/user", userRouter)

declare global {
	namespace Express {
		interface Request {
			id: string
			password: string
		}
	}
}

const checkBasicAuth: RequestHandler = (req, res, next) => {
	const authHeader = req.get("Authorization")
	if (authHeader != null && authHeader.startsWith("Basic")) {
		const encoded = authHeader.split(" ")[1]
		const decoded = Buffer.from(encoded, "base64").toString()
		const parts = decoded.split(":")
		const [id, password] = [parts[0], parts.slice(1).join(":")]
		req.id = id
		req.password = password
		next()
	} else {
		res.set("WWW-Authenticate", "Basic")
		res.status(401)
		res.end()
	}
}

app.get("/token", checkBasicAuth, async (req, res) => {
	const { id, password } = req
	const user = await getUser(id)
	if (user != null && (await bcrypt.compare(password, user.hash))) {
		const token = jwt.sign({ ...user, hash: undefined }, secret, {
			...(expiresIn != null ? { expiresIn } : {}),
			issuer,
			...(audience != null ? { audience } : {}),
			subject: id,
		})
		res.status(200)
		res.set("Content-Type", "application/jwt")
		res.send(token)
	} else {
		res.set("WWW-Authenticate", "Basic")
		res.status(401)
		res.end()
	}
})

app.get("/validate", async (req, res) => {
	try {
		jwt.verify(req.body, secret, {
			issuer,
			audience,
		})
		res.status(200)
		res.send(req.body)
	} catch (e) {
		res.status(401)
		res.send()
	}
})

// start the server
console.log(`port: ${port}`)
app.listen(port)
