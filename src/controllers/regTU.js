import request from "request";

const LOGIN_URL = "https://web.reg.tu.ac.th/registrar/validate-direct.asp";
const GRADE_URL = "https://web.reg.tu.ac.th/registrar/grade.asp";

export const requestLoginCookiesByUsernamePassword = async ({
	username,
	password
}) => {
	return new Promise((resolve, reject) => {
		var options = {
			method: "POST",
			url: LOGIN_URL,
			headers: {
				"cache-control": "no-cache",
				"content-type": "application/x-www-form-urlencoded"
			},
			form: { lang: "th", f_uid: username, f_pwd: password }
		};
		request(options, function(error, response, body) {
			if (error) reject(error);
			else {
				const {
					headers: { "set-cookie": cookies }
				} = response;
				resolve({ body, cookies });
			}
		});
	});
};
export const requestGradeHTMLByCookies = async ({ cookies }) => {
	return new Promise((resolve, reject) => {
		var options = {
			method: "GET",
			url: GRADE_URL,
			headers: {
				"user-agent":
					"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36",
				pragma: "no-cache",
				host: "web.reg.tu.ac.th",
				connection: "keep-alive",
				"cache-control": "no-cache",
				"accept-language": "en-US,en;q=0.9",
				"accept-encoding": "gzip, deflate, br",
				accept:
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
				cookie: cookies
			}
		};

		request(options, function(error, response, body) {
			if (error) reject(error);
			if (body.includes("http://web.reg.tu.ac.th/registrar/login.asp")) {
				reject("ไม่พบผู้ใช้ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
			} else {
				resolve({ html: body });
			}
		});
	});
};
