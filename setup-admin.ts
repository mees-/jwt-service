import { users, DatabaseUser, Role } from "./src/user"
import { saltRounds } from "./src/config"
import bcrypt from "bcrypt"

const userid = process.env.ADMIN_USER ?? "admin"
const userPassword = process.env.ADMIN_PASS

;(async () => {
	if (userPassword == null) {
		console.error("No admin password set. Skipping admin creation")
	} else {
		const adminUser: DatabaseUser = {
			id: userid,
			data: {},
			roles: [Role.Create, Role.Read, Role.Update, Role.Delete],
			hash: await bcrypt.hash(userPassword, saltRounds),
		}
		try {
			if ((await users.get(userid)) == null) {
				await users.set(userid, adminUser)
				console.log(
					`created user. username: ${userid}. Password supplied from ADMIN_PASS environment variable`,
				)
			} else {
				console.log(
					`A user with user id: ${userid} already exists. Skipping admin creation`,
				)
			}
		} catch (e) {
			console.error("Failed to create user!")
			console.error(e)
		}
	}
})()
