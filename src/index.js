import "./env";

import Debug from "debug";
const debug = Debug("tu-touch:api");
import { json } from "body-parser";
import express from "express";
const app = express();
app.use(json());
import morgan from "morgan";
app.use(morgan("dev"));

import { getGradesByUsernamePassword } from "./controllers/regTU";
import {
	upsertUserByUsernamePassword,
	upsertUserByRfidUsernamePassword,
	findUserByRfid
} from "./controllers/user";

app.get("/", async function(req, res) {
	// (async () => {
	try {
		const { stdId = "", stdPwd = "", stdRfid = "" } = req.query;
		// const stdId = "5809610248",
		// 	stdPwd = "ilovetu",
		// 	stdRfid = "";
		if (stdId && stdPwd && stdRfid) {
			const payload = {
				username: stdId,
				password: stdPwd,
				rfid: stdRfid
			};
			const { grades } = await getGradesByUsernamePassword(payload);

			const { result: upsertResult } = await upsertUserByRfidUsernamePassword(
				payload
			);
			debug(`upsertResult: ${upsertResult}`);

			res.status(200).send(grades);
		} else if (stdRfid) {
			const { user } = await findUserByRfid({ rfid: stdRfid });
			debug(`rfid user: ${user}`);

			if (!user) res.status(201).send("กรุณาลงทะเบียนสำหรับใช้ครั้งแรก");
			else {
				const { username, password } = user;
				const { grades } = await getGradesByUsernamePassword({
					username,
					password
				});
				debug(`grades: ${grades}`);

				const { result: upsertResult } = await upsertUserByUsernamePassword({
					username,
					password
				});
				debug(`upsertResult: ${upsertResult}`);

				res.status(200).send(grades);
			}
		} else if (!stdId) throw new Error("รหัสนักศึกษาไม่ถูกต้อง");
		else if (!stdPwd) throw new Error("รหัสผ่านไม่ถูกต้อง");
		else {
			const payload = {
				username: stdId,
				password: stdPwd
			};
			const { grades } = await getGradesByUsernamePassword(payload);
			debug("grades %o", grades);

			const { result: upsertResult } = await upsertUserByUsernamePassword(
				payload
			);
			debug(`upsertResult: ${upsertResult}`);

			res.status(200).send(grades);
		}
	} catch (error) {
		const { message = error } = error;

		debug(`error: ${message}`);
		res.status(400).send(message || error);
	}
});
// })();
const { PORT = 3000 } = process.env;
debug(`listen on port :${PORT}`);
app.listen(PORT);
