import $ from "cheerio";

export const formatGradeHTMLToJson = ({ html }) => {
	html = html.toLowerCase();
	return new Promise(async (resolve, reject) => {
		try {
			const $html = $.load(html);

			const tables = $html("table");
			const filteredTables = tables.filter((i, table) => {
				const { attribs } = table;
				return attribs["cellspacing"] === "2" && attribs["width"] === "70%";
			});

			const rows = filteredTables.find(`tr`);
			const filteredRows = rows.filter((i, row) => {
				const { attribs } = row;
				return attribs["valign"] === "top";
			});

			let jsons = [];
			filteredRows.each(function(i, row) {
				const data = $(this).find("td");
				jsons.push({
					courseId: $(data[0])
						.text()
						.trim()
						.toUpperCase(),
					courseName: $(data[1])
						.text()
						.trim()
						.toUpperCase(),
					courseCredit: $(data[2])
						.text()
						.trim()
						.toUpperCase(),
					courseGrade: $(data[3])
						.text()
						.trim()
						.toUpperCase()
				});
			});
			resolve({ grades: jsons });
		} catch (error) {
			reject(error);
		}
	});
};
