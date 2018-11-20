import { user as User } from "../model";

export const insertByUsernamePassword = async ({ username, password }) => {
	try {
		return await new User({ username, password }).save();
	} catch (error) {
		throw error;
	}
};
export const loginByUsernamePassword = async ({ username, password }) => {
	try {
		return await User.findOne({ username, password });
	} catch (error) {
		throw error;
	}
};
export const upsertUserByUsernamePassword = async ({ username, password }) => {
	try {
		const result = await User.findOneAndUpdate(
			{ username, password },
			{ username, password },
			{ upsert: true }
		);
		return { result };
	} catch (error) {
		throw error;
	}
};
export const upsertUserByRfidUsernamePassword = async ({
	rfid,
	username,
	password
}) => {
	try {
		const result = await User.findOneAndUpdate(
			{ username, password },
			{ username, password, rfid },
			{ upsert: true }
		);
		return { result };
	} catch (error) {
		throw error;
	}
};
export const findUserByRfid = async ({ rfid }) => {
	try {
		const user = await User.findOne({ rfid });
		return { user };
	} catch (error) {
		throw error;
	}
};
