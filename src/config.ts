export const connectionString = process.env.CONNECTION_STRING as string
if (connectionString == null) {
	console.error(
		"Connection string is not defined. set `CONNECTION_STRING` env variable",
	)
	process.exit(101)
}

export const secret = process.env.SECRET as string
if (secret == null) {
	console.error("Secret is not defined.\nset `SECRET` env variable")
	process.exit(102)
}

export const issuer = process.env.ISSUER as string
if (issuer == null) {
	console.error("Issuer is not defined.\nset `ISSUER` env variable")
	process.exit(103)
}

export const audience = process.env.AUDIENCE
if (audience == null) {
	console.warn(
		"Warning: audience is not set, setting this leads to better security \
consider setting `AUDIENCE` to something",
	)
}
export const expiresIn = process.env.EXPIRY_TIME
if (expiresIn == null) {
	console.warn(
		"Warning: no expiry time set. This implies tokens are valid \
forever. Set `EXPIRY_TIME` to something understood by \
https://github.com/zeit/ms",
	)
}
