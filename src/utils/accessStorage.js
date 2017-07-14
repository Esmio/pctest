import _ from 'lodash';

export function multiset(collection) {
  return new Promise((resolve, reject) => {
    if (collection.length) {
      const setItems = () => {
        _.forEach(collection, (value, key) => {
          return localStorage.setItem(key, value);
        });
      };

      resolve(setItems);
    } 
    reject(`multiset expected an object but get ${typeof collection}`);
  });
}
