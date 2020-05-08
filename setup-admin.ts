import { users, DatabaseUser, Role } from "./src/user"
import { saltRounds } from "./src/config"
import bcrypt from "bcrypt"

const userid = process.env.ADMIN_ID ?? "admin"
const userPassword = process.env.ADMIN_PASS

;(async () => {
	if (userPassword == null) {
		console.error("No admin password set. Exiting")
		process.exit(201)
	}
	const adminUser: DatabaseUser = {
		id: userid,
		data: {},
		roles: [Role.Create, Role.Read, Role.Update, Role.Delete],
		hash: await bcrypt.hash(userPassword, saltRounds),
	}
	try {
		await users.set(userid, adminUser)
		console.log(
			`created user. username: ${userid}. Password supplied from ADMIN_PASS environment variable`,
		)
	} catch (e) {
		console.error("Failed to create user!")
		console.error(e)
	}
})()
