import "../env";

import {
	requestLoginCookiesByUsernamePassword,
	requestGradeHTMLByCookies
} from "./controllers/regTU";
import { formatGradeHTMLToJson } from "./controllers/formatData";

const { STD_ID = "", STD_PWD = "" } = process.env;
const main = async () => {
	try {
		const { cookies } = await requestLoginCookiesByUsernamePassword({
			username: STD_ID,
			password: STD_PWD
		});
		const { html } = await requestGradeHTMLByCookies({ cookies });
		const { grades } = await formatGradeHTMLToJson({ html });
		console.log(grades);
	} catch (error) {
		console.log(error);
	}
};
main();
