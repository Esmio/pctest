import { encrypt } from '../utils/';

export function awaitHash(username, password) {
	return new Promise((resolve, reject) => {
		encrypt(username, password, (hash) => {
			if (hash) {
				resolve(hash);
			}
			reject('unable to get hash');
		});
	}).catch((err) => {
		throw new Error(err);
	});
}
