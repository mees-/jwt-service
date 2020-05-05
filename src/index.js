const express = require("express")
const Keyv = require("keyv")
const getPort = require("get-port")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const bodyParser = require("body-parser")
const morgan = require("morgan")

const SALT_ROUNDS = 10

const app = express()
const users = new Keyv(process.env.CONNECTION_STRING, { namespace: "users" })
const config = new Keyv(process.env.CONNECTION_STRING, { namespace: "config" })

app.use(morgan(process.env.NODE_ENV === "developlent" ? "dev" : "tiny"))

app.use(bodyParser.json())
app.use(bodyParser.text({ type: "application/jwt" }))

app.get("/token", async (req, res) => {
	console.log("1")
	const { username, password } = req.body
	console.log("a")
	const user = await users.get(username)
	console.log("b")
	const valid = user && (await bcrypt.compare(password, user.hash))
	console.log("c")
	if (valid) {
		const token = jwt.sign({}, await config.get("secret"), {
			expiresIn: await config.get("exp"),
			issuer: await config.get("iss"),
			audience: await config.get("aud"),
			subject: username,
		})
		res.status(200)
		res.send(token)
	} else {
		res.set("WWW-Authenticate", "JWT_SERVICE")
		res.status(401)
		res.end()
	}
})

app.get("/validate", async (req, res) => {
	console.log("body", req.body)
	try {
		jwt.verify(req.body, await config.get("secret"), {
			issuer: await config.get("iss"),
			audience: await config.get("aud"),
		})
		res.status(200)
		res.send(req.body)
	} catch (e) {
		res.status(401)
		res.send()
	}
})

app.post("/user", async (req, res) => {
	const { username, password } = req.body
	if (await users.get(username)) {
		res.status(403)
		res.send("Error: cannot create user")
	} else {
		const hash = await bcrypt.hash(password, SALT_ROUNDS)
		await users.set(username, { username, hash })
		res.status(200)
		res.send({ username })
	}
})

app.delete("/user", async (req, res) => {
	try {
		jwt.verify(req.body, await config.get("secret"), {
			issuer: await config.get("iss"),
			audience: await config.get("aud"),
		})
		const deleted = await users.delete(req.body.username)
		res.status(200)
		req.send()
	} catch (e) {
		res.status(401)
		res.send()
	}
})

getPort({ port: 5000 }).then((port) => {
	console.log(`port: ${port}`)
	app.listen(port)
})
