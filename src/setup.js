const Keyv = require("keyv")

const config = new Keyv(process.env.CONNECTION_STRING, { namespace: "config" })

;(async () => {
	await config.clear()
	await Promise.all([
		// config.set("secret", "ENTER YOUR SECRET"),
		// config.set("iss", "your issuer"),
		config.set("exp", "24h"),
		// config.set("aud", "your audience"),
	])
	console.log("all set!")
})()
