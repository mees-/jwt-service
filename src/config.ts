export const connectionString = process.env.CONNECTION_STRING as string
if (connectionString == null) {
	console.error(
		"Connection string is not defined. set `CONNECTION_STRING` env variable",
	)
	process.exit(101)
}

let portTemp = process.env.PORT
if (portTemp == null) {
	console.info("INFO: port is not set, defaulting to 5000")
	portTemp = "5000"
}
export const port = portTemp as String
export const secret = process.env.SECRET as string
if (secret == null) {
	console.error("Secret is not defined. set `SECRET` env variable")
	process.exit(102)
}

export const issuer = process.env.ISSUER as string
if (issuer == null) {
	console.error("Issuer is not defined. set `ISSUER` env variable")
	process.exit(103)
}

export const audience = process.env.AUDIENCE
if (audience == null) {
	console.warn(
		"WARNING: audience is not set, setting this leads to better security. \
consider setting `AUDIENCE` to something",
	)
}
export const expiresIn = process.env.EXPIRY_TIME
if (expiresIn == null) {
	console.warn(
		"WARNING: no expiry time set. This implies tokens are valid \
forever. Set `EXPIRY_TIME` to something understood by \
https://github.com/zeit/ms",
	)
}

export const saltRounds = 10
