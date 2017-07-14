import bcrypt from 'bcryptjs';

function getSecretFromUserNamePassword(username, password) {
	return username.substring(0, 3) +
	password.substring(0, 3) +
	username.substring(username.length - 2, username.length) +
	password.substring(password.length - 2, password.length) +
	username.length + password.length;
}
function callBackBuf(len) {
	const buf = new Uint8Array(len);
	for (let i = 0; i < buf.length; i++) {
		buf[i] = Math.floor(Math.random() * ((256 - (1 + 1)) + 1));
	}
	return buf;
}
function logErr(err) {
	throw new Error(err);
}
export function encrypt(username, password, callBack) {
	bcrypt.setRandomFallback(callBackBuf);
	const str = getSecretFromUserNamePassword(username, password);
	bcrypt.genSalt(6, (saltErr, salt) => {
		if (saltErr) {
			logErr(saltErr);
		}
    bcrypt.hash(str, salt, (hashErr, hash) => {
				if (hashErr) {
					logErr(hashErr);
				}
				return callBack(hash.substring(7));
    });
	});
}
