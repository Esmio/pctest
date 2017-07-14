import moment from 'moment';

/* eslint-disable quotes */
import { request, API, awaitHash } from '../utils/';

export function getHomepageInfo() {
  return request(API.homeInfo);
}
export function getTopWinners() {
  return request(API.findTopWinners);
}
export function getAllHistory() {
  return request(API.allHistory);
}
export function getMyLoginHistory({ accessToken }) {
  return request(`${API.loginHistory}?pageSize=20&access_token=${accessToken}`);
}
export function getAllGamesSetting(prizeGroup) {
  return request(`${API.gameSetting}&prizeGroup=${prizeGroup}`);
}
export function getCurrentResults(gameId) {
  return request(`${API.gamePlan}/${gameId}`);
}
export function getThisGameHistory({ thisGameId, resultLimit }) {
	return request(`${API.uniqueGameHistory}/${thisGameId}?limit=${resultLimit}`);
}
export function getSpecialOfferList() {
	return request(API.specialOfferList);
}
export function checkUserId(username) {
	return request(`${API.userId}/${username}`);
}
export function getCurrentUser(accessToken) {
	return request(`${API.userInfo}?access_token=${accessToken}`);
}
export function getHelpList() {
	return request(API.helpList);
}
export function getCardsAndWithdrawDetail({ accessToken }) {
  return request(`${API.userBanksAccount}?access_token=${accessToken}`);
}
export function getUserLogout(token) {
	return request(`${API.logout}?access_token=${token}`);
}
export function getBankCardDetails({ selectedBankCardId, accessToken }) {
	return request(`${API.userCards}/${selectedBankCardId}?access_token=${accessToken}`);
}
export function getPaymentList({ accessToken }) {
	return request(`${API.paymentList}?access_token=${accessToken}`);
}
export function getBankList({ accessToken }) {
	return request(`${API.bankList}/v2?access_token=${accessToken}`);
}
export function getOrderDetails({ accessToken }, { transactionTimeuuid }) {
	return request(
		`${API.orderDetail}?transactionTimeuuid=${transactionTimeuuid}&access_token=${accessToken}`
	);
}
export function getValidatePic({ varifyCode, webUniqueCode }) {
	return request(
		`${API.validatePic}?validateCode=${varifyCode.value}&webUniqueCode=${webUniqueCode}`
	);
}
export function getCommissionDetail(userModel, dataTableModel) {
	const { accessToken, taskIdentifier } = userModel;
	const { pageSize } = dataTableModel;
	const url = [
		API.commissionDetail,
		`?pageSize=${pageSize * 10}`,
		`&currentPage=1`,
		`&access_token=${accessToken}`,
		`&taskIdentifier=${taskIdentifier}`
	];
	return request(_.join(url, ''));
}
export function getOrderHistory({ userModel, dataTableModel, orderModel }) {
	const { accessToken } = userModel;
	const { pageSize } = dataTableModel;
	const { state } = orderModel;
	const url = [
		API.orderHistory,
		`?pageSize=${pageSize * 10}`,
		`&currentPage=1`,
		`&access_token=${accessToken}`
	];
	if (state !== 'ALL') {
		url.push(`&state=${state}`);
	}
	return request(_.join(url, ''));
}
export function getMemberList({ userModel, dataTableModel, teamModel }) {
	const { accessToken } = userModel;
	const { pageSize, start, currentPage } = dataTableModel;
	const { agentId, usernameSearchString } = teamModel;
	const url = [
		API.memberList,
		`?pageSize=${pageSize}`,
		`&start=${start}`,
		`&currentPage=${currentPage}`,
		`&access_token=${accessToken}`
	];
	if (agentId) { url.push(`&agentId=${agentId}`); }
	if (usernameSearchString) { url.push(`&username=${usernameSearchString}`); }
	return request(_.join(url, ''));
}
export function getTransactionHistory({ userModel, dataTableModel, transactionModel }) {
	const { accessToken } = userModel;
	const { pageSize, currentPage } = dataTableModel;
	const { type, subType, state } = transactionModel;
	const url = [
		API.transactionHistory,
		`?pageSize=${pageSize * 10}`,
		`&currentPage=${currentPage}`,
		`&access_token=${accessToken}`
	];
	if (type !== 'ALL') {
		url.push(`&type=${type}`);
	}
	if (subType !== 'ALL') {
		url.push(`&subType=${subType}`);
	}
	if (state !== 'ALL') {
		url.push(`&state=${state}`);
	}
	return request(_.join(url, ''));
}
export function putUserLogin({ username, password, varifyCode, webUniqueCode }) {
	return awaitHash(username.value, password.value).then((hash) => {
		return request(API.webLogin, {
			method: 'post',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				hash,
				password: password.value,
				username: username.value,
				validateCode: varifyCode.value,
				wap: true,
				webUniqueCode
			})
		});
	});
}
export function putRealName({ accessToken }, { realName }) {
	const url = [
		API.updateRealName,
		`?realName=${realName.value}`,
		`&access_token=${accessToken}`
	];
	return request(_.join(url, ''), {
		method: 'put',
		headers: {
			'content-type': 'application/json'
		}
	});
}
export function putUserInfo({ accessToken }, {
	email, identityNumber, nickname,
	phoneNumber, qq, username, prizeGroup, memberType
}) {
	return request(`${API.updateUserInfo}/?access_token=${accessToken}`, {
		method: 'put',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			memberType,
			prizeGroup: _.toNumber(prizeGroup.value),
			email: email.value,
			identityNumber: `${identityNumber.value}`,
			nickname: nickname.value,
			phoneNumber: phoneNumber.value,
			username: username.value,
			qq: qq.value
		})
	});
}
export function putRegisterInfo({ accessToken }, {
	realName, securityPassword, bankAccountName,
	bankAddress, bankCardNo, bankCode, bankName,
	remarks,
}) {
	return request(`${API.updateBankInfo}/?access_token=${accessToken}`, {
		method: 'put',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			realName: realName.value,
			securityPassword: securityPassword.value,
			userBankCardDto: {
				bankAccountName: bankAccountName.value || realName.value,
				bankAddress: bankAddress.value,
				bankCardNo: bankCardNo.value,
				bankCode: bankCode.value,
				bankName: bankName.value,
				remarks: remarks.value
			}
		})
	});
}
export function putDefaultBankAccount({
	selectedBankCardId, accessToken
}) {
	return request(`${API.userCards}/${selectedBankCardId}?access_token=${accessToken}`, {
		method: 'put',
		headers: {
			'content-type': 'application/json'
		}
	});
}
export function putOddTransfer({ userModel, formModel, transferModel }) {
	const { realName, accessToken } = userModel;
	const { paymentId, paymentPlatformOrderNo, paymentKey } = transferModel;
	const { topupAmount } = formModel;
	let transferToupType = '';
	if (paymentKey === 'ZHB') {
		transferToupType = 'ALIPAY';
	} else if (paymentKey === 'WX') {
		transferToupType = 'WECHATPAY';		
	}
	const dateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
	return request(`${API.bankTransfers}/v3?access_token=${accessToken}`, {
		method: 'put',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			adminBankId: paymentId,
			paymentPlatformOrderNo,
			topupAmount: topupAmount.value,
			topupCardRealname: realName,
			topupTime: dateTime,
			transferToupType
		})
	});
}
export function putBankTransferConfirmation({ userModel, formModel, transferModel }) {
	const { realName, accessToken } = userModel;
	const { adminBankId, paymentPlatformOrderNo } = transferModel;
	const { topupAmount, topupCardRealname, topupTime, transferToupType } = formModel;
	return request(`${API.bankTransfers}/v3?access_token=${accessToken}`, {
		method: 'put',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			adminBankId,
			paymentPlatformOrderNo,
			topupAmount: topupAmount.value,
			topupCardRealname: topupCardRealname.value || realName,
			topupTime: topupTime.value.format('YYYY-MM-DD HH:mm:ss'),
			transferToupType: transferToupType.value
		})
	});
}
export function putAffCode({ userModel, formModel, payload }) {
	const { accessToken } = userModel;
	const { id } = payload;
	const { affCodeStatus, affCodeUrl, prizeGroup, memberType } = formModel;
	return request(`${API.affCode}/${id}?access_token=${accessToken}`, {
		method: 'put',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			memberType,
			status: affCodeStatus.value,
			url: affCodeUrl.value,
			prizeGroup: _.toNumber(prizeGroup.value),
		})
	});
}
export function deleteBankAccount({
	selectedBankCardId, accessToken
}) {
	return request(`${API.userCards}/${selectedBankCardId}?access_token=${accessToken}`, {
		method: 'delete',
		headers: {
			'content-type': 'application/json'
		}
	});
}
export function deleteAffCode({ accessToken }, { id }) {
	return request(`${API.affCode}/${id}?access_token=${accessToken}`, {
		method: 'delete',
		headers: {
			'content-type': 'application/json'
		}
	});
}
export function postAffUrl({ randomCode }) {
	return request(API.affCodeUrl, {
		method: "post",
    headers: {
      'content-type': "application/json"
    },
    body: JSON.stringify({ randomCode })
	});
}
export function postEntries({ order, accessToken }) {
  const body = JSON.stringify(order);
  return request(`${API.ordercap}?access_token=${accessToken}`, {
    method: "post",
    headers: {
      'content-type': "application/json"
    },
    body
  });
}
export function postBankInfo({ accessToken }, {
  bankAccountName, bankAddress, bankCardNo,
	bankCode, bankName, remarks, realName
}) {
  return request(`${API.userCards}/?access_token=${accessToken}`, {
		method: 'post',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			bankAccountName: bankAccountName.value || realName.value,
			bankAddress: bankAddress.value,
			bankCardNo: bankCardNo.value,
			bankCode: bankCode.value,
			bankName: bankName.value,
			remarks: remarks.value
		})
	});
}
export function getMyCashFlow(
	{ accessToken }, { endTime, start, startTime, moneyOperationTypes, pageSize, targetUser }
) {
	const body = {
		startTime: `${startTime.format('YYYY-MM-DD')} 00:00:00`,
		endTime: `${endTime.format('YYYY-MM-DD')} 23:59:59`,
		start,
		pageSize,
		moneyOperationTypes,
	};
	if (targetUser) {
		body.username = targetUser;
	}
	return request(`${API.userBalance}?access_token=${accessToken}`, {
		method: 'post',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify(body)
	});
}
export function getAffCodesList({ accessToken }, { pageSize }) {
	return request(`${API.affCodeList}?access_token=${accessToken}`, {
		method: 'post',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			pageSize: pageSize * 10
		})
	});
}
export function getMyCommission({ accessToken, status }, { start, startTime, endTime, pageSize }) {
	return request(`${API.myCommissions}/?access_token=${accessToken}`, {
		method: 'post',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			status: status === 'ALL' ? '' : status,
			start,
			pageSize: pageSize * 10,
			startTime: `${startTime.format('YYYY-MM-DD')} 00:00:00`,
			endTime: `${endTime.format('YYYY-MM-DD')} 23:59:59`
		})
	});
}
export function postTopupRequest({ userModel, formModel, transferModel }) {
	const { realName, accessToken } = userModel;
	const { bankCode, paymentId, paymentType } = transferModel;
	const { topupAmount } = formModel;
	const { value } = topupAmount;
	return request(`${API.topups}?access_token=${accessToken}`, {
		method: 'post',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			bankCode, depositor: realName, paymentId, paymentType, topupAmount: value
		})
	});
}
export function postPreRegisterGuest() {
	return request(API.preRegisterGuest, {
		method: 'post',
		headers: {
			'content-type': 'application/json'
		},
	});
}
export function postRegistration({ username, password, varifyCode, webUniqueCode, affCode }) {
	let registerAPI = API.webRegister;
	if (username.value && username.value.indexOf('Guest') > -1) {
		registerAPI = API.webRegisterGuest;
	}
	return awaitHash(username.value, password.value).then((hash) => {
		return request(registerAPI, {
			method: 'post',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				affCode: affCode.value,
				hash,
				password: password.value,
				username: username.value,
				validateCode: varifyCode.value,
				wap: true,
				webUniqueCode
			})
		});
	});
}
export function postNewPassword(userModel, formModel) {
	const { accessToken } = userModel;
	const { newPassword, securityMode } = formModel;
	const passwordTarget = _.camelCase(securityMode);
	const password = formModel[passwordTarget].value;
	return request(`${API.changePwd}/?access_token=${accessToken}`, {
		method: 'post',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			mode: securityMode, newPassword: newPassword.value, password
		})
	});
}
export function postBankTransferRequest({ accessToken }, { adminBankId }) {
	return request(`${API.bankTransfers}/v2?access_token=${accessToken}`, {
		method: 'post',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({ adminBankId })
	});
}
export function postWithdrawalRequest({ userModel, transferModel, formModel }) {
	const { accessToken } = userModel;
	const { userBankId } = transferModel;
	const { withdrawalAmount, charge, securityPassword } = formModel;
	return request(`${API.userWithDraw}?access_token=${accessToken}`, {
		method: 'post',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			amount: withdrawalAmount.value,
			charge: charge.value,
			userBankId,
			withDrawCode: securityPassword.value
		})
	});
}
export function postUser({ accessToken }, {
	username, password, memberType, prizeGroup,
	realName, phoneNumber, qq, email
}) {
	return request(`${API.createDownline}?access_token=${accessToken}`, {
		method: 'post',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			username: username.value,
			password: password.value,
			memberType,
			prizeGroup: _.toNumber(prizeGroup.value),
			realName: realName.value,
			phoneNumber: phoneNumber.value,
			qq: qq.value,
			email: email.value
		})
	});
}
export function postAffCode({ accessToken }, {
	affCode, affCodeStatus, prizeGroup, memberType
}) {
	return request(`${API.affCode}?access_token=${accessToken}`, {
		method: 'post',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			affCode: affCode.value,
			memberType,
			status: affCodeStatus.value,
			registerUrl: window.location.hostname,
			prizeGroup: _.toNumber(prizeGroup.value),
		})
	});
}
