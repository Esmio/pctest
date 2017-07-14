import { message } from 'antd';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import { type as TYPE } from '../utils';
import { apiRequest as request, validate } from '../services';
import { accentCinnabar, accentTeal } from '../styles/variables.less';

const INITIAL_STATE = {
  accessToken: null,
  authenticationState: 'REGISTER',
  awaitingResponse: false,
  bankAccounts: [],
  banksOptions: TYPE.banksOptions,
  cardIsDefault: false,
  dailyWithdrawWithAdminSettingsResult: '',
  generatedVarifyCode: '',
  myCashFlow: [],
  myCashFlowCount: 0,
  myCommissionHistory: [],
  commissionDetail: [],
  commissionDetailCount: 0,
  myLoginHistory: [],
  password: '',
  passwordInputMsg: '',
  selectedBankCardId: '',
  status: 'ALL',
  taskIdentifier: '',
  totalBetsSum: 0,
  totalCommission: 0,
  userAgreed: true,
  userData: null,
  userIdExist: null,
};

export default {
	namespace: 'userModel',
	state: INITIAL_STATE,
	reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    initializeState(state, { payload }) {
      const initialStates = _.pick(INITIAL_STATE, payload);
      return { ...state, ...initialStates };
    },
    initializeAll(state) {
      return { ...state, ...INITIAL_STATE };
    },
    getUserIdSuccess(state, { payload }) {
      const { data } = payload;
      let msg = '';
      msg = data.checkState ? '用户名存在' : `${TYPE.title}，该用户名不存在哟~`;
      return { ...state,
        passwordInputMsg: '',
        userIdExist: data.checkState,
        usernameInputMsg: {
          icon: 'checkbox-marked-circle-outline',
          color: accentTeal,
          message: msg
        },
      };
    },
    getCardsAndWithdrawDetailSuccess(state, { payload }) {
      return { ...state, ...payload };
    },
    updateInfoSuccess(state, { payload }) {
      const { target } = payload;
      return { ...state,
        [`${target}InfosFormResponse`]: {
          icon: 'checkbox-marked-circle-outline',
          color: accentTeal,
          message: `${TYPE[target]}信息更新成功`
        }
      };
    },
    updateInfoFailed(state, { payload }) {
      const { target } = payload;
      return { ...state,
        [`${target}InfosFormResponse`]: {
          icon: 'close-circle-outline',
          color: accentCinnabar,
          message: payload.message
        }
      };
    },
    toggleAgree(state) {
      const { userAgreed } = state;
      return { ...state, userAgreed: !userAgreed };
    },
    toggleAccountInfoTarget(state, { payload }) {
      return { ...state,
        accountInfoEditTarget: payload,
        withdrawalInfosFormResponse: INITIAL_STATE.withdrawalInfosFormResponse,
        accountInfosFormResponse: INITIAL_STATE.accountInfosFormResponse
      };
    },
    validateInputPassed(state, { payload }) {
      const { name, inputMessage } = payload;
      const result = {
        icon: 'checkbox-marked-circle-outline',
        color: accentTeal,
        message: inputMessage
      };
      return { ...state, [`${name}InputMsg`]: result, [`${name}ValidatePassed`]: true };
    },
    validateInputFailed(state, { payload }) {
      const { name, inputMessage } = payload;
      const result = {
        icon: 'close-circle-outline',
        color: accentCinnabar,
        message: inputMessage
      };
      return { ...state, [`${name}InputMsg`]: result, [`${name}ValidatePassed`]: false };
    }
  },
	effects: {
    *secureAuthentication({ payload }, { put }) {
      const { msg } = payload;
      localStorage.removeItem(TYPE.accessToken);
      yield put({ type: 'initializeAll' });
      yield put({ type: 'teamModel/initializeAll' });
      yield put({ type: 'transactionModel/initializeAll' });
      yield put({ type: 'orderModel/initializeAll' });
      yield put({ type: 'transferModel/initializeAll' });
      yield put({
        type: 'layoutModel/updateState',
        payload: {
          shouldShowProfileModal: false, shouldShowAuthModel: true,
        }
      });
      yield put({ type: 'updateState', payload: { authenticationState: 'LOGIN' } });
      yield put({
        type: 'formModel/updateState',
        payload: {
          responseMsg: {
            msg: `此账号已登出，${msg}`, icon: 'close-circle-outline', color: accentCinnabar
          }
        }
      });
    },
    *getUserId({ payload }, { call, put }) {
      const response = yield call(validate.checkUserId, payload);
      const { data, err } = response;
      if (data) {
        yield put({ type: 'getUserIdSuccess', payload: response });
      } else if (!err && !data) {
        console.warn('查询用户名', payload);
      }
    },
    *getMyLoginHistory(payloadObj, { call, put, select }) {
      const { userModel } = yield select(state => state);
      const response = yield call(request.getMyLoginHistory, userModel);
      const { data, err } = response;
      if (data) {
        yield put({ type: 'updateState', payload: { myLoginHistory: data.datas } });
      } else if (err) {
        if (err.statusCode === '401') {
          yield put({
            type: 'secureAuthentication',
            payload: { msg: err.message }
          });
        } else {
          console.warn('无法获取登录历史', err.message);
        }
      }
    },
    *getMyCommission(payloadObj, { call, put, select }) {
      yield put({ type: 'updateState', payload: { awaitingResponse: true } });
      const { userModel, dataTableModel } = yield select(state => state);
      const response = yield call(request.getMyCommission, userModel, dataTableModel);
      const { data, err } = response;
      if (data) {
        const { datas, totalBetsSum, totalCommission } = data;
        yield put({
          type: 'updateState',
          payload: {
            myCommissionHistory: datas, totalBetsSum, totalCommission
          }
        });
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });
      } else if (err) {
        if (err.statusCode === '401') {
          yield put({
            type: 'secureAuthentication',
            payload: { msg: err.message }
          });
        } else {
          throw new Error(`无法获取佣金历史, ${err.message}`);
        }
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });        
      }
    },
    *getCommissionDetail(payloadObj, { call, put, select }) {
      yield put({ type: 'updateState', payload: { awaitingResponse: true } });
      const { userModel, dataTableModel } = yield select(state => state);
      const response = yield call(request.getCommissionDetail, userModel, dataTableModel);
      const { data, err } = response;
      if (data) {
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });
        yield put({
          type: 'updateState',
          payload: {
            commissionDetail: data.datas,
            commissionDetailCount: data.totalCount
          }
        });
      } else if (err) {
        if (err.statusCode === '401') {
          yield put({
            type: 'secureAuthentication',
            payload: { msg: err.message }
          });
        } else {
          throw new Error(`无法获取佣金详情，${err.message}`);
        }
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });
      }
    },
    *getUserLogout({ payload }, { call, put, select }) {
      const { accessToken } = yield select(state => state.userModel);
      const response = yield call(request.getUserLogout, accessToken);
      const { err, data } = response;
      const logoutMsg = payload || '用户登出成功';
      if (data) {
        localStorage.removeItem(TYPE.accessToken);
        yield put({ type: 'initializeState', payload: _.keys(INITIAL_STATE) });
        yield put({
          type: 'layoutModel/initializeState',
          payload: ['shouldShowProfileModal', 'shouldShowAuthModel']
        });
        message.success(logoutMsg);        
      } else if (err) {
        message.error(`用户登出 ${err.message}`);
      }
    },
    *getAccessToken(payloadObj, { put }) {
      const accessToken = yield localStorage.getItem(TYPE.accessToken);
      if (accessToken) {
        yield put({ type: 'updateState', payload: { accessToken } });
        yield put({ type: 'getCurrentUser' });
        yield put({ type: 'getCardsAndWithdrawDetail' });        
      }
    },
    *getCurrentUser(payloadObj, { call, put, select }) {
      const { accessToken } = yield select(state => state.userModel);
      const response = yield call(request.getCurrentUser, accessToken);
      const { err, data } = response;
      if (data) {
        yield put({
          type: 'updateState', payload: { ...data, userData: data }
        });
        yield put({
          type: 'initializeState', payload: ['userIdExist']
        });
      } else if (err) {
        if (err.statusCode === '401') {
          yield put({
            type: 'secureAuthentication',
            payload: { msg: err.message }
          });
        } else {
          message.warning(`登陆失败，${err.message}`);
        }
      }
    },
    *getMyCashFlow(payloadObj, { call, put, select }) {
      yield put({ type: 'updateState', payload: { awaitingResponse: true } });
      const { userModel, dataTableModel } = yield select(state => state);
      const response = yield call(request.getMyCashFlow, userModel, dataTableModel);
      const { data, err } = response;
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            myCashFlow: data.datas,
            myCashFlowCount: data.totalCount
          }
        });
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });
      } else if (err) {
        if (err.statusCode === '401') {
          yield put({
            type: 'secureAuthentication',
            payload: { msg: err.message }
          });
        } else {
          throw new Error(`无法获取账户明细，${err.message}`);
        }
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });
      }
    },
    *getCardsAndWithdrawDetail(payloadObj, { call, put, select }) {
      const { userModel } = yield select(state => state);
      const response = yield call(request.getCardsAndWithdrawDetail, userModel);
      const { err, data } = response;
      if (data) {
        yield put({
          type: 'getCardsAndWithdrawDetailSuccess',
          payload: data
        });
      } else if (err) {
        if (err.statusCode === '401') {
          yield put({
            type: 'secureAuthentication',
            payload: { msg: err.message }
          });
        } else {
          throw new Error(`无法获取银行卡信息, ${err.message}`);
        }
      }
    },
    *putUserLogin(payloadObj, { call, put, select }) {
      yield put({ type: 'updateState', payload: { awaitingResponse: true } });      
      const { formModel } = yield select(state => state);
      const response = yield call(request.putUserLogin, formModel);
      const { err, data } = response;
      if (data) {
        const accessToken = data.oauthToken.access_token;
        yield localStorage.setItem(TYPE.accessToken, accessToken);
        yield put({ type: 'updateState', payload: { accessToken } });        
        yield put({ type: 'getCurrentUser' });
        yield put({ type: 'getCardsAndWithdrawDetail' });
        yield put({
          type: 'formModel/initializeState', payload: ['username', 'password', 'varifyCode']
        });
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });        
        yield put({
          type: 'layoutModel/updateState', payload: { shouldShowAuthModel: false }
        });
      } else if (err) {
        yield put({ type: 'formModel/getBrowserUniqueId' });
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: err.message, icon: 'checkbox-marked-circle-outline', color: accentCinnabar
            }
          }
        });
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });
      }
    },
    *putUserRealName(payloadObj, { call, put, select }) {
      yield put({ type: 'updateState', payload: { awaitingResponse: true } });
      const { userModel, formModel } = yield select(state => state);
      const response = yield call(request.putRealName, userModel, formModel);
      const { err } = response;
      if (err) {
        if (err.statusCode === '401') {
          yield put({
            type: 'secureAuthentication',
            payload: { msg: err.message }
          });
        } else {
          yield put({
            type: 'formModel/updateState',
            payload: {
              responseMsg: {
                msg: err.message, icon: 'checkbox-marked-circle-outline', color: accentCinnabar
              }
            }
          });
        }
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });
      } else {
        yield put({ type: 'getCurrentUser' });
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: '已开始审核更新信息，请您耐性等待。',
              icon: 'checkbox-marked-circle-outline',
              color: accentTeal
            }
          }
        });
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });        
      }
    },
    *putUserInfo(payloadObj, { call, put, select }) {
      yield put({ type: 'updateState', payload: { awaitingResponse: true } });
      
      const { userModel, formModel } = yield select(state => state);
      const response = yield call(request.putUserInfo, userModel, formModel);
      const { err } = response;
      if (err) {
        if (err.statusCode === '401') {
          yield put({
            type: 'secureAuthentication',
            payload: { msg: err.message }
          });
        } else {
          yield put({
            type: 'formModel/updateState',
            payload: {
              responseMsg: {
                msg: err.message, icon: 'checkbox-marked-circle-outline', color: accentCinnabar
              }
            }
          });
        }
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });
      } else {
        yield put({ type: 'getCurrentUser' });        
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: '信息绑定', icon: 'checkbox-marked-circle-outline', color: accentTeal
            }
          }
        });
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });        
      }
    },
    *putRegisterInfo(payloadObj, { call, put, select }) {    
      const { formModel, userModel } = yield select(state => state);
      const response = yield call(request.putRegisterInfo, userModel, formModel);
      const { err } = response;
      if (err) {
        if (err.statusCode === '401') {
          yield put({
            type: 'secureAuthentication',
            payload: { msg: err.message }
          });
        } else {
          yield put({
            type: 'formModel/updateState',
            payload: {
              responseMsg: {
                msg: err.message, icon: 'checkbox-marked-circle-outline', color: accentCinnabar
              }
            }
          });
        }
      } else {
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: '添加银行卡成功', icon: 'checkbox-marked-circle-outline', color: accentTeal
            }
          }
        });
        yield put({ type: 'getCurrentUser' });
        yield put({ type: 'getCardsAndWithdrawDetail' });
        yield put({
          type: 'formModel/initializeState',
          payload: ['bankName', 'bankCode', 'bankAddress', 'bankCardNo', 'remarks']
        });
      }
    },
    *putDefaultBankAccount(payloadObj, { call, put, select }) {
      const userModel = yield select(state => state.userModel);
      const response = yield call(request.putDefaultBankAccount, userModel);
      const { err } = response;
      if (!err) {
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: '默认银行卡设定成功', icon: 'checkbox-marked-circle-outline', color: accentTeal
            }
          }
        });
        yield put({ type: 'getCardsAndWithdrawDetail' });
      } else if (err) {
        if (err.statusCode === '401') {
          yield put({
            type: 'secureAuthentication',
            payload: { msg: err.message }
          });
        } else {
          throw new Error(err.message);
        }
      }
    },
    *postBankInfo(payloadObj, { call, put, select }) {
      const { userModel, formModel } = yield select(state => state);
      const response = yield call(request.postBankInfo, userModel, formModel);
      const { err } = response;
      if (err) {
        if (err.statusCode === '401') {
          yield put({
            type: 'secureAuthentication',
            payload: { msg: err.message }
          });
        } else {
          yield put({
            type: 'formModel/updateState',
            payload: {
              responseMsg: {
                msg: err.message, icon: 'checkbox-marked-circle-outline', color: accentCinnabar
              }
            }
          });
        }
      } else {
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: '添加银行卡成功', icon: 'checkbox-marked-circle-outline', color: accentTeal
            }
          }
        });
        yield put({ type: 'getCardsAndWithdrawDetail' });
        yield put({
          type: 'formModel/initializeState',
          payload: ['bankName', 'bankCode', 'bankAddress', 'bankCardNo', 'remarks']
        });
      }
    },
    *postPreRegisterGuest(payloadObj, { call, put }) {
      yield put({ type: 'updateState', payload: { awaitingResponse: true } });
      const response = yield call(request.postPreRegisterGuest);
      const { data, err } = response;
      if (data) {
        yield put({
          type: 'formModel/updateState',
          payload: {
            username: { value: data.username },
          }
        });
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });
      } else if (err) {
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: err.message, icon: 'checkbox-marked-circle-outline', color: accentCinnabar
            }
          }
        });
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });
      }
    },
    *postRegistration(payloadObj, { call, put, select }) {
      yield put({ type: 'updateState', payload: { awaitingResponse: true } });
      const { formModel } = yield select(state => state);
      const response = yield call(request.postRegistration, formModel);
      const { err, data } = response;
      if (data) {
        yield put(routerRedux.replace('/'));
        yield put({ 
          type: 'formModel/initializeState',
          payload: ['password', 'repeatPassword', 'varifyCode', 'varifyPassed', 'userAgreed']
        });
        const accessToken = data.oauthToken.access_token;
        yield localStorage.setItem(TYPE.accessToken, accessToken);
        yield put({ type: 'updateState', payload: { accessToken } });
        message.success('恭喜您已注册成功！');
        yield put({ type: 'getCurrentUser' });
        yield put({
          type: 'updateState',
          payload: { awaitingResponse: false }
        });
        yield put({
          type: 'layoutModel/updateState', payload: { shouldShowAuthModel: false }
        });
      } else if (err) {
        yield put({ type: 'formModel/getBrowserUniqueId' });
        
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: err.message, icon: 'close-circle-outline', color: accentCinnabar
            }
          }
        });
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });
      }
    },
    *postPasswordInfo(payloadObj, { call, put, select }) {
      const { userModel, formModel } = yield select(state => state);
      const response = yield call(request.postNewPassword, userModel, formModel);
      const { securityMode } = formModel;
      const passwordTarget = _.camelCase(securityMode);

      const { err } = response;
      if (err) {
        if (err.statusCode === '401') {
          yield put({
            type: 'secureAuthentication',
            payload: { msg: err.message }
          });
        } else {
          yield put({
            type: 'formModel/updateState',
            payload: {
              responseMsg: {
                msg: err.message, icon: 'close-circle-outline', color: accentCinnabar
              }
            }
          });
        }
      } else {
        yield put({
          type: 'formModel/initializeState',
          payload: [passwordTarget, 'newPassword', 'repeatNewPassword']
        });
        if (securityMode === TYPE.SECURITY_PASSWORD) {
          yield put({
            type: 'formModel/updateState',
            payload: {
              responseMsg: {
                msg: '提款密码更换成功', icon: 'checkbox-marked-circle-outline', color: accentTeal
              }
            }
          });
        } else {
          yield put({ type: 'getUserLogout', payload: '您的密码已经修改成功，请重新登录。' });
        }
      }
    },
    *deleteBankAccount(payloadObj, { call, put, select }) {
      const userModel = yield select(state => state.userModel);
      const response = yield call(request.deleteBankAccount, userModel);
      const { err } = response;
      if (!err) {
        yield put({
          type: 'formModel/updateState',
          payload: {
            responseMsg: {
              msg: '删除银行卡成功', icon: 'checkbox-marked-circle-outline', color: accentTeal
            }
          }
        });
        yield put({ type: 'getCardsAndWithdrawDetail' });
      } else if (err) {
        if (err.statusCode === '401') {
          yield put({
            type: 'secureAuthentication',
            payload: { msg: err.message }
          });
        } else {
          throw new Error(err.message);
        }
      }
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
			return history.listen(({ search }) => {
        if (!search || search.indexOf('?pt=') < 0) {
          dispatch({ type: 'getAccessToken' });
        } else {
          localStorage.removeItem(TYPE.accessToken);
        }
			});
		}
  }
};
