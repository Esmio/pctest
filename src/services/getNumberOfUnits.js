
/*
	@gameUniqueId: String: 彩种Id
	@methodId: String: 玩法Id
	@thisBetString: String: 主单号
	@betString: [Array]: 注单号分割数组
	@digitArr: [Array]: 任选号码分割数组
	@int: Number: 号码整数
*/
export function getNumbersOfUnits({ gameUniqueId, methodId, thisBetString }) {
	// console.log(gameUniqueId, methodId, thisBetString);
	if (!thisBetString || !methodId || !gameUniqueId) return 0;
	let digitArr = [];
	let betString = '';
	let digitStr = '';
	let RxArr = [];
	if (thisBetString.indexOf(':') > -1) {
		RxArr = thisBetString.split(':');
		betString = RxArr[1];
		digitStr = RxArr[0];
		digitArr = digitStr.split(' ');
	} else {
		betString = thisBetString;
	}
	switch (gameUniqueId) {
		case 'HF_CQSSC':
		case 'HF_XJSSC':
		case 'HF_TJSSC':
		case 'HF_JXSSC':
		case 'HF_LFSSC': {
			return getNumberOfSSC({ methodId, betString, digitArr });
		}
		case 'HF_BJPK10':
		case 'HF_LFPK10': {
			return getNumberOfPK10({ methodId, betString });
		}
		case 'HF_SHD11':
		case 'HF_GDD11':
		case 'HF_JXD11':
		case 'HF_SDD11':
		case 'HF_AHD11': {
			return getNumberOfD11({ methodId, betString });
		}
		case 'HF_BJ28':
		case 'HF_SG28': {
			return getNumberOf28({ methodId, betString });
		}
		case 'X3D':
		case 'HF_SHSSL':
		case 'PL3': {
			return getNumberOfX3D({ methodId, betString });
		}
		case 'MARK_SIX': {
			return getNumberOfMark6({ betString });
		}
		case 'HF_CQKL10F':
		case 'HF_TJKL10F':
		case 'HF_GDKL10F': {
			return getNumberOfKL10({ methodId, betString });
		}
		case 'HF_AHK3':
		case 'HF_JSK3':
		case 'HF_GXK3': {
			return getNumberOfK3({ methodId, betString });
		}
		default: 
			console.warn('彩种ID不正确');
	}
}
// K3
function getNumberOfK3({ methodId, betString }) {
	switch (methodId) {
		case 'HZ':
		case 'STHTX':
		case 'STHDX':
		case 'SLHTX':
		case 'ETHFX': {
			return getBetNumberOfZX({ betString });
		}
		case 'SBTH': {
			return getBetNumberOf3DZFS({ betString, int: 3 });
		}
		case 'EBTH': {
			return getBetNumberOf3DZFS({ betString, int: 2 });
		}
		case 'ETHDX': {
			return getBetNumberOfZX({ betString });
		}
		case 'EBTHDT': {
			return getBetNumberOfD11AnyTD({ betString, int: 2 });
		}
		case 'CYG': {
			return getBetNumberOfZX({ betString }) * 21;
		}
		default: 
			console.warn(`无法在彩种K3里找到${methodId}算法`);
	}
}
// KL10
function getNumberOfKL10({ methodId, betString }) {
	switch (methodId) {
		case 'ST1':
		case 'RT1': {
			return getBetNumberOfZX({ betString });
		}
		case 'DC2': {
			return getBetNumberOfAny4ZX4({ betString });
		}
		case 'CC2':
		case 'KL2': {
			return getBetNumberOf3DZFS({ betString, int: 2 });
		}
		case 'DT3': {
			return getBetNumberOfKL10Q3({ betString });
		}
		case 'CT3':
		case 'KL3': {
			return getBetNumberOf3DZFS({ betString, int: 3 });
		}
		case 'KL4': {
			return getBetNumberOf3DZFS({ betString, int: 4 });
		}
		case 'KL5': {
			return getBetNumberOf3DZFS({ betString, int: 5 });
		}
		default: 
			console.warn(`无法在彩种KL10里找到${methodId}算法`);
	}
}
// 前三直
function getBetNumberOfKL10Q3({ betString }) {
	const arr = betString.split('|');
	const arr1 = arr[0].split(' ');
	const	arr2 = arr[1].split(' ');
	const	arr3 = arr[2].split(' ');
	let number = 0;
	if (arr1) {
		arr1.map((item) => {
			const nextArrIndex = arr2.indexOf(item);
			console.log(nextArrIndex);
			const arr2Copy = arr2.slice();
			if (nextArrIndex > -1) arr2Copy.splice(nextArrIndex, 1);
			arr2Copy.map((item2) => {
				const nextArr3Index2 = arr3.indexOf(item2);
				const	nextArr3Index1 = arr3.indexOf(item);
				const arr3Copy = arr3.slice();
				if (nextArr3Index2 > -1) arr3Copy.splice(nextArr3Index2, 1);
				if (nextArr3Index1 > -1) arr3Copy.splice(nextArr3Index1, 1);
				number += arr3Copy.length;
			});
		});
	}
	return number;
}

// MARK_SIX 
function getNumberOfMark6(arr) {
	return getBetNumberOfZX(arr);
}

// X3D 

// X3D 
function getNumberOfX3D({ methodId, betString }) {
	switch (methodId) {
		case 'NIO3':
		case 'F2IO':
		case 'L2IO':
		case 'NS1P':
		case 'L2BSOE':
		case 'F2BSOE': {
			return getBetNumberOfZX({ betString });
		}
		case 'F2':
		case 'L2':
		case 'NS2P': {
			return getBetNumberOf3DZFS({ betString, int: 2 });
		}
		case 'NS3': {
			return getBetNumberOfAny3Sum({ betString });
		}
		case 'GRP3': {
			return 2 * getBetNumberOf3DZFS({ betString, int: 2 });
		}
		case 'GRP6': {
			return getBetNumberOf3DZFS({ betString, int: 3 });
		}
		case 'G3S': {
			return getBetNumberOf3DSumZ3({ betString });
		}
		case 'G6S': {
			return getBetNumberOf3DSumZ6({ betString });
		}
		case 'SP': {
			return getBetNumberOfDN({ betString });
		}
		default: 
			console.warn(`无法在彩种X3D里找到${methodId}算法`);
	}
}
// 三星-组三复式
function getBetNumberOf3DZFS({ betString, int }) {
	const arr = betString.split(' ');
	return arr[0] ? combination(arr.length, int) : 0;
}
// 三星-组三和值
function getBetNumberOf3DSumZ3({ betString }) {
	const arr = betString.split(' ');
	let num = 0;
	arr.map((item) => {
		const itemInt = parseInt(item, 10);
		for (let i = 9; i >= 0; i--) {
			for (let j = 0; j < i; j++) {
				if ((i * 2) + j === itemInt || i + (j * 2) === itemInt) {
					num++;
				}
			}
		}
	});
	return num;
}
// 三星-组六和值
function getBetNumberOf3DSumZ6({ betString }) {
	const arr = betString.split(' ');
	let num = 0;
	arr.map((item) => {
		const itemInt = parseInt(item, 10);
		for (let i = 9; i >= 0; i--) {
			for (let j = i - 1; j >= 0; j--) {
				for (let k = j - 1; k >= 0; k--) {
					if (i + j + k === itemInt) {
						num++;
					}
				}
			}
		}
	});
	return num;
}

// 28
function getNumberOf28({ methodId, betString }) {
	switch (methodId) {
		case 'MIX':
		case 'SP':
		case 'BS':
		case 'BZ': {
			return getBetNumberOf28HH({ betString });
		}
		case 'SP3': {
			return getBetNumberOf28TMB3({ betString });
		}
		default: 
			console.warn(`无法在彩种28里找到${methodId}算法`);
	}
}
// 混合
function getBetNumberOf28HH({ betString }) {
	const arr = betString.split(' ');
	return arr.length ? arr.length : 0;
}
// 特码包三
function getBetNumberOf28TMB3({ betString }) {
	const arr = betString.split(' ');
	return (arr && arr.length === 3) ? 1 : 0;
}

// D11
function getNumberOfD11({ methodId, betString }) {
	switch (methodId) {
		case 'R2':
		case 'Q2C': {
			return getBetNumberOfD11Any({ betString, int: 2 });
		}
		case 'R3':
		case 'Q3C': {
			return getBetNumberOfD11Any({ betString, int: 3 });
		}
		case 'R4': {
			return getBetNumberOfD11Any({ betString, int: 4 });
		}
		case 'R5': {
			return getBetNumberOfD11Any({ betString, int: 5 });
		}
		case 'R6': {
			return getBetNumberOfD11Any({ betString, int: 6 });
		}
		case 'R7': {
			return getBetNumberOfD11Any({ betString, int: 7 });
		}
		case 'R8': {
			return getBetNumberOfD11Any({ betString, int: 8 });
		}
		case 'Q1Z': {
			return getBetNumberOfD11Q1ZX({ betString });
		}
		case 'Q2Z': {
			return getBetNumberOfQ2({ betString });
		}
		case 'Q3Z': {
			return getBetNumberOfQ3({ betString });
		}
		case 'R2DT':
		case 'Q2CDT': {
			return getBetNumberOfD11AnyTD({ betString, int: 2 });
		}
		case 'R3DT':
		case 'Q3CDT': {
			return getBetNumberOfD11AnyTD({ betString, int: 3 });
		}
		case 'R4DT': {
			return getBetNumberOfD11AnyTD({ betString, int: 4 });
		}
		case 'R5DT': {
			return getBetNumberOfD11AnyTD({ betString, int: 5 });
		}
		case 'R6DT': {
			return getBetNumberOfD11AnyTD({ betString, int: 6 });
		}
		case 'R7DT': {
			return getBetNumberOfD11AnyTD({ betString, int: 7 });
		}
		case 'R8DT': {
			return getBetNumberOfD11AnyTD({ betString, int: 8 });
		}
		default: 
			console.warn(`无法在彩种D11里找到${methodId}算法`);
	}
}
// 前一直选
function getBetNumberOfD11Q1ZX({ betString }) {
	const arr = betString.split(' ');
	return arr.length;
}
// 任选
function getBetNumberOfD11Any({ betString, int }) {
	const arr = betString.split(' ');
	return combination(arr.length, int);
}
// 任选胆拖 
function getBetNumberOfD11AnyTD({ betString, int }) {
	const arr = betString.split('|');
	let arr1 = arr[0];
	let arr2 = arr[1];
	arr1 = arr1.split(' ');
	arr2 = arr2.split(' ');
	const length1 = arr1[0] ? arr1.length : 0;
	const length2 = arr2[0] ? arr2.length : 0;
	let number = 0;
	if (!length1) number = 0;
	else {
		number = combination(length2, int - length1);
	}
	return number;
}

// PK10
function getNumberOfPK10({ methodId, betString }) {
	switch (methodId) {
		case 'D1': {
			return getBetNumberOfQ1({ betString });
		}
		case 'GT2': {
			return getBetNumberOfQ2({ betString });
		}
		case 'GT3': {
			return getBetNumberOfQ3({ betString });
		}
		case 'DN': {
			return getBetNumberOfPK10DN({ betString });
		}
		default: 
			console.warn(`无法在彩种PK10里找到${methodId}算法`);
	}
}
// 定位胆
function getBetNumberOfPK10DN({ betString }) {
	let PK10DNString = betString.replace(/\|/g, ' ');
	PK10DNString = PK10DNString.trim();
	const arr = PK10DNString.split(' ');
	let number = 0;
	number = arr[0] ? arr.length : 0;
	return number;
}
function getBetNumberOfQ1({ betString }) {
	const arr = betString.split(' ');
	if (!arr[0]) { return 0; } else return arr.length;
}
function getBetNumberOfQ2({ betString }) {
	const arr = betString.split('|');
	const arr1 = arr[0].trim().split(' ');
	const arr2 = arr[1].trim().split(' ');
	let number = 0;
	arr1.map((item) => {
		if (item && arr2[0]) {
			number += arr2.indexOf(item) > -1 ? arr2.length - 1 : arr2.length;
		}
	});
	return number;
}

function getBetNumberOfQ3({ betString }) {
	// const result = [];
	const arr = betString.split('|');
	const arr1 = arr[0].trim().split(' ');
	const arr2 = arr[1].trim().split(' ');
	const arr3 = arr[2].trim().split(' ');
	let number = 0;
	for (let i = 0; i < arr1.length; i++) {
		for (let j = 0; j < arr2.length; j++) {
			if (arr1[i] !== arr2[j]) {
				for (let k = 0; k < arr3.length; k++) {
					if (arr1[i] !== arr3[k] && arr2[j] !== arr3[k]) {
						number++;
						// const item = [i, j, k];
						//result.push(item);// 所有投注结果
					}
				}
			}
		}
	}
	console.log('pk10resutl',result.length)	
	return number;
}
// 时时彩
function getNumberOfSSC({ methodId, betString, digitArr }) {
	switch (methodId) {
		case 'DN': {
			return getBetNumberOfDN({ betString });
		}
		case 'C5':
		case 'D5':
		case 'D3':
		case 'D2':
		case 'DXDS':
		case 'DXDS_H3':
		case 'DXDS_Q2':
		case 'DXDS_Q3':
		case 'BDW_Q31':
		case 'BDW_H31':
		case 'BDW_Q41':
		case 'BDW_H41':
		case 'BDW_Q51': {
			return getBetNumberOfZX({ betString });
		}
		case 'C33': {
			return getBetNumberOfZ3({ betString });
		}
		case 'C36':
		case 'BDW_Q53': {
			return getBetNumberCommon({ betString, int: 3 });
		}
		case 'C2':
		case 'BDW_Q32':
		case 'BDW_H32':
		case 'BDW_Q42':
		case 'BDW_H42':
		case 'BDW_Q52': {
			return getBetNumberCommon({ betString, int: 2 });
		}
		case 'R2Z': {
			return getBetNumberOfAny2({ betString, int: 2 });
		}
		case 'R2Z_HZ': {
			return getBetNumberOfAny2Sum({ betString, digitArr });
		}
		case 'R3Z_HZ': {
			return getBetNumberOfAny3Sum({ betString, digitArr });
		}
		case 'R2C': {
			return getBetNumberOfAnyZX({ betString, digitArr, int: 2 });
		}
		case 'R3C6': {
			return getBetNumberOfAnyZX({ betString, digitArr, int: 3 });
		}
		case 'R3C3': {
			return getBetNumberOfAny3Z3({ betString, digitArr });
		}
		case 'R2C_HZ': {
			return getBetNumberOfAny2SumZX({ betString, digitArr });
		}
		case 'R3C_HZ': {
			return getBetNumberOfAny3SumZX({ betString, digitArr });
		}
		case 'R3Z': {
			return getBetNumberOfAny3({ betString, int: 3 });
		}
		case 'R4Z': {
			return getBetNumberOfAny4({ betString, int: 4 });
		}
		case 'R4C24': {
			return getBetNumberOfAny4ZX24({ betString, digitArr });
		}
		case 'R4C12': {
			return getBetNumberOfAny4ZX12({ betString, digitArr });
		}
		case 'R4C6': {
			return getBetNumberOfAny4ZX6({ betString, digitArr });
		}
		case 'R4C4': {
			return getBetNumberOfAny4ZX4({ betString, digitArr });
		}
		default: 
			console.warn(`无法在彩种SSC里找到${methodId}算法`);
	}
}

// 注数

// 处理排列数
function combination(length, j) {
	if (j <= 0) return 0;
	if (j === 1) return length;
	let number = 0;
	for (let i = length; i >= j; i--) {
		number += combination(i - 1, j - 1);
	}
	return number;
}

// 通用
function getBetNumberCommon({ betString, digitArr }) {
	return combination(betString.replace(/\s/g, '').length, digitArr);
}

// 三星组六 可用通用替代
function getBetNumberOfZ6({ betString }) {
	const z6String = betString.replace(/\s/g, '');
	const length = z6String.length;
	return combination(length, 3);
}
// 三星组三
function getBetNumberOfZ3({ betString }) {
	const z3string = betString.replace(/\s/g, '');
	const length = z3string.length;
	return combination(length, 2) * 2;
}

// 直选
function getBetNumberOfZX({ betString }) {
	let number = 0;
	const arr = betString.split('|');
	if (!arr.join().replace(/,/g, '')) {
		number = 0;
	} else {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i]) {
				let digit = arr[i];
				digit = digit.split(' ');
				const length = digit.length;
				number = number ? number * length : length;
			} else {
				number = 0;
				break;
			}
		}
	}
	return number;
}
//定位胆
function getBetNumberOfDN({ betString }) {
	let number = 0;
	const DNString = betString.replace(/\|/g, '').replace(/\s/g, '');
	number = DNString.length;
	return number;
}

// 任选二-直选复式
function getBetNumberOfAny2({ betString, digitArr }) {
	let number = 0;
	let commonNumbers = 0; 
	let invalidNumbers = 0;
	const totalStr = betString.slice();
	const totalLength = totalStr.replace(/[\s\|]/g, '').length;
	commonNumbers = combination(totalLength, digitArr);
	const arr = betString.split('|');
	arr.map((item) => {
		const itemStr = item.replace(/\s/g, '');
		const itemLength = itemStr.length;
		invalidNumbers += combination(itemLength, digitArr);
	});
	number = commonNumbers - invalidNumbers;
	return number;
}
// 任选三-直选复式
function getBetNumberOfAny3({ betString, digitArr }) {
	let number = 0;
	let commonNumbers = 0; 
	let invalidNumbers = 0;
	const totalStr = betString.slice();
	const totalLength = totalStr.replace(/[\s\|]/g, '').length;
	commonNumbers = combination(totalLength, digitArr);
	const arr = betString.split('|');
	// const currentDigit = digitArr;
	arr.map((item) => {
		const itemStr = item.replace(/\s/g, '');
		const itemLength = itemStr.length;
		invalidNumbers += combination(itemLength, digitArr);
		invalidNumbers += (
			combination(itemLength, 2) * 
			(combination(totalLength - 2, digitArr - 2) - combination(itemLength - 2, digitArr - 2))
		);
	});
	number = commonNumbers - invalidNumbers;
	return number;
}
// 任选四-直选复式 
function getBetNumberOfAny4({ betString }) {
	let number = 0;
	const totalStr = betString.slice();
	// const totalLength = totalStr.replace(/[\s\|]/g, '').length;
	const subIndex = totalStr.indexOf('|');
	const firstArr = totalStr.substring(0, subIndex);
	const arrForAny3 = totalStr.substring(subIndex + 1);
	const firstLength = firstArr.split(' ').length;
	const lastNumbers = getBetNumberOfAny3(arrForAny3, 3);
	number += firstLength * lastNumbers;
	if (betString.split('|').length >= 3) number += getBetNumberOfAny4(arrForAny3, 3);
	return number;
}
// 任选二 直选和值
function getBetNumberOfAny2Sum({ betString, digitArr }) {
	const arr = betString.split(' ');
	let num = 0;
	arr.map((item) => {
		for (let i = 0; i <= 9; i++) {
			for (let j = 0; j <= 9; j++) {
				if (i + j === parseInt(item, 10)) {
					num++;
				}
			}
		}
	});
	const length = digitArr.length;
	const times = combination(length, 2);
	const number = times * num;
	return number;
}
// 任选三-直选和值
function getBetNumberOfAny3Sum({ betString, digitArr }) {
	const arr = betString.split(' ');
	let num = 0;
	let times = 1;
	arr.map((item) => {
		for (let i = 0; i <= 9; i++) {
			for (let j = 0; j <= 9; j++) {
				for (let k = 0; k <= 9; k++) {
					if (i + j + k === parseInt(item, 10)) {
						num++;
					}
				}
			}
		}
	});
	if (digitArr) times = combination(digitArr.length, 3);
	const number = times * num;
	return number;
}

// 任选二-组选和值 
function getBetNumberOfAny2SumZX({ betString, digitArr }) {
	const arr = betString.split(' ');
	let num = 0;
	arr.map((item) => {
		for (let i = 0; i <= 9; i++) {
			for (let j = 0; j <= 9; j++) {
				if (i !== j && i + j === parseInt(item, 10)) {
					num++;
				}
			}
		}
	});
	num /= 2;
	arr.map((item) => {
		for (let i = 0; i <= 9; i++) {
			for (let j = 0; j <= 9; j++) {
				if (i === j && i + j === parseInt(item, 10)) {
					num++;
				}
			}
		}
	});
	const length = digitArr.length;
	const times = combination(length, 2);
	const number = times * num;
	return number;
}
// 任选三-组选和值
function getBetNumberOfAny3SumZX({ betString, digitArr }) {
	const arr = betString.split(' ');
	let num = 0;
	let num1 = 0; 
	let num2 = 0;
	arr.map((item) => {
		for (let i = 0; i <= 9; i++) {
			for (let j = 0; j <= 9; j++) {
				for (let k = 0; k <= 9; k++) {
					if (i + j + k === parseInt(item, 10)) {
						if (i !== j && j !== k && i !== k) {
							num1++;
						} else if ((i === j || j === k || i === k) && !(i === j && j === k)) {
							num2++;
						} else if (i === j && j === k) {
							num++;
						}
					}
				}
			}
		}
	});
	num += (num1 / 6) + (num2 / 3);
	const length = digitArr.length;
	const times = combination(length, 3);
	const number = times * num;
	return number;
}
// 任选二-组选复式   任选三-组六复式
function getBetNumberOfAnyZX({ betString, digitArr, int }) {
	const arr = betString.split(' ');
	const arrLength = arr.length;
	const digitLength = digitArr.length;
	const arrNumber = combination(arrLength, int);
	const digitNubmer = combination(digitLength, int);
	const number = arrNumber * digitNubmer;
	return number;
}
// 任选三-组三复式
function getBetNumberOfAny3Z3({ betString, digitArr }) {
	const arr = betString.split(' ');
	const arrLength = arr.length;
	const digitLength = digitArr.length;
	const arrNumber = combination(arrLength, 2) * 2;
	const digitNubmer = combination(digitLength, 3);
	const number = arrNumber * digitNubmer;
	return number;
}
// 任选四-组选24
function getBetNumberOfAny4ZX24({ betString, digitArr }) {
	const length = betString.split(' ').length;
	const digitLength = digitArr.length;
	const number = combination(length, 4) * combination(digitLength, 4);
	return number;
}
// 任选四-组选12
function getBetNumberOfAny4ZX12({ betString, digitArr }) {
	const arr = betString.split('|');
	const arr1 = arr[0].split(' ');
	const	arr2 = arr[1].split(' ');
	let number = 0;
	arr1.map((item) => {
		number += arr2.indexOf(item) > -1 ? 
			combination(arr2.length - 1, 2) : 
			combination(arr2.length, 2);
	});
	const times = combination(digitArr.length, 4);
	return number * times;
}
// 任选四-组选6
function getBetNumberOfAny4ZX6({ betString, digitArr }) {
	const length = betString.split(' ').length;
	const digitLength = digitArr.length;
	return combination(length, 2) * combination(digitLength, 4);
}
// 任选四-组选4  二连直
function getBetNumberOfAny4ZX4({ betString, digitArr }) {
	const arr = betString.split('|');
	let number = 0;
	const arr1 = arr[0].split(' ');
	const arr2 = arr[1].split(' ');
	// const length1 = arr1.length;
	const	length2 = arr2.length;
	for (const num in arr1) {
		if (arr2.indexOf(num) > -1) {
			number += (length2 - 1);
		} else {
			number += length2;
		}
	}
	return digitArr ? combination(digitArr.length, 4) * number : number;
}
