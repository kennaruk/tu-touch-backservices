const debug = require("debug")("tu-touch:model");

if (!process.env.MONGO_CONN && !process.env.MONGO_DB) {
	debug("env for mongo not found");
	process.exit(1);
}

import mongoose from "mongoose";
import { readdir } from "fs";

const connURL = process.env.MONGO_CONN;
const dbName = process.env.MONGO_DB || "";
const conn = `${connURL}${dbName}`;

debug(`Connecting to mongodb ${conn}`);
mongoose
	.connect(
		conn,
		{
			useCreateIndex: true,
			useNewUrlParser: true
		}
	)
	.then(() => {
		debug(`MongoDB connected`);
	})
	.catch(e => {
		debug(`MongoDB connection error ${e}`);
		process.exit(-1);
	});

readdir(__dirname, (err, files) => {
	if (err) {
		debug(`Model readdir err ${e}`);
		process.exit(-2);
	}
	files.forEach(function(file) {
		/*
		 * initializes all models and sources them as .Modelfilename
		 */
		if (file !== "index.js") {
			const fileName = file.split(".")[0];
			const moduleName = fileName.charAt(0).toUpperCase() + fileName.substr(1);
			exports[moduleName] = require("./" + moduleName)["model"];
		}
	});
});
