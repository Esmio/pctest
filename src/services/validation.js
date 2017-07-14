import bcrypt from 'bcryptjs';
import Fingerprint2 from 'fingerprintjs2';
import { request, API } from '../utils/';

export const check = (({ value, min, max, pattern }) => {
  const reg = new RegExp(pattern);
  const condition = reg.test(value) && value.length >= min && value.length <= max;
  return condition;
});

export function checkUserId(value) {
	return request(`${API.userId}/${value}`);
}

export function generateVarifyCode() {
  const timestamp = new Date().getTime();
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(6, (err, salt) => {
      if (err) { reject(err); }
      bcrypt.hash(`${timestamp}`, salt, (hashErr, hash) => {
          if (hash) {
            const varifyCode = hash.substring(15, 21);
            resolve(varifyCode);
          }
          reject(hashErr);
      });
    });
  });
}

export function generateBrowserId() {
  const timestamp = new Date().getTime();
  return new Promise((resolve, reject) => {
    Fingerprint2().get((browerId) => {
      if (browerId) {
        bcrypt.genSalt(6, (err, salt) => {
          if (err) { reject(err); }
          bcrypt.hash(`${browerId}+${timestamp}`, salt, (hashErr, hash) => {
              if (hash) {
                const varifyCode = hash.substring(15, 21);
                resolve(varifyCode);
              }
              reject(hashErr);
          });
        });
      }
    });
  });
}
