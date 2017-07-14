const clientID = 31;

export const checkIpInfo = '/api/v1/update/checkIpInfo';
export const gameSetting = `/api/v1/adminsettings/user/prizeSettings?clientId=${clientID}`;

export const homeInfo = `/api/v1/cms/internal/pc/${clientID}/contents?clientId=${clientID}`;
export const updateVersion = '/api/v1/cms/internal/lastVersion';
export const getMessageList = '/api/v1/cms/Message/playerMessages';

export const getHistoryList = '/api/v1/result/service/mobile/results/today';
export const allHistory = '/api/v1/result/service/mobile/results/lastOpen';
export const currentResults = '/api/v1/result/service/mobile/results/current';
export const gamePlan = '/api/v1/result/service/mobile/results/currentTwo';
export const uniqueGameHistory = '/api/v1/result/service/mobile/results/hist/';

export const getValidatePic = '/api/v1/account/webapi/account/validateCode/getValidatePic';
export const validatePic = '/api/v1/account/webapi/account/validateCode/validatePic';
export const changePwd = '/api/v1/account/webapi/account/users/change/password';
export const updateRealName = '/api/v1/account/webapi/account/users/updateRealName';
export const updateUserInfo = '/api/v1/account/webapi/account/users';
export const createDownline = updateUserInfo;
export const updateBankInfo = '/api/v1/account/webapi/account/users/register_info';
export const register = '/api/v1/account/webapi/account/users/register';
export const registerGuest = '/api/v1/account/webapi/account/users/registerGuest';
export const webRegisterGuest = '/api/v1/account/webapi/account/users/webRegisterGuest';
export const webRegister = '/api/v1/account/webapi/account/users/userWebRegister';
export const login = '/api/v1/account/webapi/account/users/login';
export const webLogin = '/api/v1/account/webapi/account/users/webLogin';
export const loginHistory = '/api/v1/account/webapi/account/users/loginHistory';
export const userInfo = '/api/v1/account/webapi/account/users/current';
export const userId = '/api/v1/account/webapi/account/users/chekcUserId';
export const logout = '/api/v1/account/account/system/logout';
export const refreshToken = '/api/v1/account/account/system/refreshToken/';
export const preRegisterGuest = '/api/v1/account/webapi/account/users/preRegisterGuest';

export const userCards = '/api/v1/cashmgt/me/cards';
export const bankTransfers = '/api/v1/cashmgt/me/transfer/topups/banktransfers';
export const userBanksAccount = '/api/v1/cashmgt/me/cards/cardsAndWithdrawDetail';
export const banktransfersQuery = '/api/v1/cashmgt/me/transfer/topups/banktransfers';
export const bankList = '/api/v1/cashmgt/me/transfer/topups/banktransfers/banklist';
export const userWithDraw = '/api/v1/cashmgt/me/transfer/withdrawals';
export const paymentList = '/api/v1/cashmgt/me/transfer/topups/payment/list';
export const transactionHistory = '/api/v1/cashmgt/me/transfer/orderhistory';
export const topups = '/api/v1/cashmgt/me/transfer/topups';

export const ordercap = '/api/v1/ordercap/me';

export const orderHistory = '/api/v1/orderdata/me/orders/findByState';
export const orderDetail = '/api/v1/orderdata/me/orders/findByTimeuuid';
export const findTopWinners = `/api/v1/orderdata/me/orders/findTopWinners?clientId=${clientID}`;

export const balanceHistory = '/api/v1/balance/me/history';
export const myCashFlow = '/api/v1/balance/me/details';
export const userBalance = '/api/v1/balance/me/balance/details';
export const myCommissions = '/api/v1/balance/me/commissions';
export const commissionDetail = '/api/v1/balance/me/commissions/details';

export const memberList = '/api/v1/account/webapi/team/users/list';
export const affCodeList = '/api/v1/account/webapi/team/affiliates/list';
export const affCode = '/api/v1/account/webapi/team/affiliates';
export const affCodeUrl = '/api/v1/account/webapi/team/affiliates/affCode';

export const helpList = `api/v1/cms/internal/helpList/${clientID}`;
export const specialOfferList = `/api/v1/cms/internal/promotion?contentType=PC_PROMOTION&adminId=${clientID}`;
