import _ from 'lodash';
import moment from 'moment';
import { type as TYPE } from '../utils';
import { validate, apiRequest as request } from '../services';
import lessVar from '../styles/variables.less';

const { accentTeal, accentCinnabar } = lessVar;

const INITIAL_STATE = {
  affCode: { value: '' },
  affCodeStatus: { value: 'ON' },
  affCodeUrl: { value: '' },
  bankAccountName: { value: '' },
  bankAddress: { value: '' },
  bankCardExist: false,
  bankCardNo: { value: '' },
  bankCode: { value: '' },
  bankName: { value: '' },
  banksOptions: TYPE.banksOptions,
  cardIsDefault: false,
  charge: { value: '' },
  email: { value: '' },
  generatedVarifyCode: '',
  identityNumber: { value: '' },
  memberType: 'AGENT',
  newPassword: { value: '' },
  nickname: { value: '' },
  password: { value: '' },
  phoneNumber: { value: '' },
  prizeGroup: { value: 1800 },
  qq: { value: '' },
  realName: { value: '' },
  receiptName: { value: '' },
  remarks: { value: '' },
  repeatNewPassword: { value: '' },
  repeatPassword: { value: '' },
  repeatSecurityPassword: { value: '' },
  responseMsg: { msg: '', color: '', icon: '' },
  securityMode: TYPE.PASSWORD,
  securityPassword: { value: '' },
  selectedBankId: '',
  topupAmount: { value: '' },
  transferAmount: { value: '' },
  topupCardRealname: { value: '' },
  topupTime: { value: moment(new Date()) },
  transferToupType: { value: '' },
  userAgreed: true,
  username: { value: '' },
  varifyCode: { value: '' },
  varifyPassed: false,
  withdrawalAmount: { value: '' },
  webUniqueCode: ''
};

export default {
  namespace: 'formModel',
  state: INITIAL_STATE,
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    initializeState(state, { payload }) {
      const initialState = _.pick(INITIAL_STATE, payload);
      return { ...state, ...initialState };
    },
    validateInput(state, { payload }) {
      payload.persist();
      const { inputFieldRefs } = TYPE;
      const eventTarget = payload.target;
      const { value, name, pattern, min, max, placeholder } = eventTarget;
      const eventValue = value;
      const reg = new RegExp(pattern);
      const validatePassed = (
        reg.test(eventValue) && `${eventValue}`.length >= min && `${eventValue}`.length <= max
      );
      const result = {
        value: eventValue,
        inputMsg: validatePassed ? `${inputFieldRefs[name]}格式正确` : placeholder,
        color: validatePassed ? accentTeal : accentCinnabar,
        icon: validatePassed ? 'checkbox-marked-circle-outline' : 'close-circle-outline'
      };
      return { ...state, [name]: result };
    },
    validateRepeatInput(state, { payload }) {
      payload.persist();
      const { inputFieldRefs } = TYPE;
      const eventTarget = payload.target;
      const { name, pattern, min, max, placeholder } = eventTarget;
      const eventValue = eventTarget.value;
      const reg = new RegExp(pattern);
      const validatePassed = (
        reg.test(eventValue) && eventValue.length >= min && eventValue.length <= max
      );
      let targetName = name.substring(6, name.length);
      targetName = _.lowerFirst(targetName);
      let result = {};
      if (validatePassed && eventValue.length) {
        if (state[name].value === state[targetName].value) {
          result = {
            value: eventValue,
            inputMsg: `${inputFieldRefs[name]}格式正确`,
            color: accentTeal,
            icon: 'checkbox-marked-circle-outline'
          };
        } else {
          result = {
            value: eventValue,
            inputMsg: '请重复一样的密码',
            color: accentCinnabar,
            icon: 'close-circle-outline'
          };
        }
      } else {
        result = {
          value: eventValue,
          inputMsg: placeholder,
          color: accentCinnabar,
          icon: 'close-circle-outline'
        };
      }
      return { ...state, [name]: result };
    }
  },
  effects: {
    // get
    *getBasicDetails(dispatch, { put, select }) {
      const { userModel } = yield select(state => state);
      const userData = _.pick(
        userModel.userData,
        ['email', 'nickname', 'phoneNumber', 'realName', 'prizeGroup', 'role', 'username']
      );
      const payload = _.mapValues(userData, (data) => {
        return { value: data };
      });
      payload.memberType = userData.role;
      yield put({
        type: 'updateState', payload
      });
    },
    *getBrowserUniqueId(payloadObj, { put }) {
      const webUniqueCode = yield validate.generateBrowserId();
      yield put({
        type: 'updateState', payload: { webUniqueCode }
      });
    },
    *getBankCardDetails(payloadObj, { call, put, select }) {
      const { userModel } = yield select(state => state);
      const { banksOptions } = userModel;
      const response = yield call(request.getBankCardDetails, userModel);
      const { data, err } = response;
      if (data) {
        const { bankName, isDefault } = data;
        const cardDataNeeded = _.pick(data,
          ['bankAccountName', 'bankAddress', 'bankCardNo', 'bankName']
        );
        const formValues = _.mapValues(cardDataNeeded, (value) => {
          return { value };
        });
        const bankCode = _.findKey(banksOptions, ['displayName', bankName]);
        yield put({
          type: 'updateState',
          payload: {
            bankCode: { value: bankCode },
            bankCardExist: true,
            cardIsDefault: isDefault,
            ...formValues
          }
        });
      } else if (err) {
        throw new Error('无法获取银行卡信息', err.message);
      }
    },
    *getUsernameExistState({ payload }, { call, put, select }) {
      payload.persist();
      const eventTarget = payload.target;
      const { value, max, min, pattern, placeholder, name } = eventTarget;
      const response = yield call(request.checkUserId, value);
      const { data, err } = response;
      const reg = new RegExp(pattern);
      const validatePassed = (
        reg.test(value) && `${value}`.length >= min && `${value}`.length <= max
      );
      const { userModel } = yield select(state => state);
      const { inputFieldRefs } = TYPE;
      if (data) {
        const { checkState } = data;
        const { authenticationState } = userModel;
        const isRegister = authenticationState === 'REGISTER';
        const isLogin = authenticationState === 'LOGIN';
        let result = { value, inputMsg: '', color: accentCinnabar, icon: 'close-circle-outline' };
        if (!validatePassed) {
          result = {
            value,
            inputMsg: placeholder,
            color: accentCinnabar,
            icon: 'close-circle-outline'
          };
        } else if (isRegister) {
          result = {
            value,
            inputMsg: checkState ? '用户名已存在，请改用别的用户名' : `${inputFieldRefs[name]}可用`,
            color: checkState ? accentCinnabar : accentTeal,
            icon: checkState ? 'close-circle-outline' : 'checkbox-marked-circle-outline' 
          };
        } else if (isLogin) {
          result = {
            value,
            inputMsg: checkState ? `${inputFieldRefs[name]}格式正确` : '用户名并不存在',
            color: checkState ? accentTeal : accentCinnabar,
            icon: checkState ? 'checkbox-marked-circle-outline' : 'close-circle-outline' 
          };
        }
        yield put({ type: 'updateState', payload: { username: result } });
      } else if (err) {
        yield put({
          type: 'updateState',
          payload: {
            username: {
              value,
              inputMsg: err.message,
              color: accentCinnabar,
              icon: 'close-circle-outline'
            }
          }
        });
      }
    },
    *getValidatePic(payloadObj, { call, put, select }) {
      const { formModel } = yield select(state => state);
      const response = yield call(request.getValidatePic, formModel);
      const { data, err } = response;
      const { varifyCode } = formModel;
      if (data) {
        const result = {
          value: varifyCode.value,
          inputMsg: '验证码通过',
          color: accentTeal,
          icon: 'checkbox-marked-circle-outline'
        };
        yield put({ type: 'updateState', payload: { varifyPassed: data } });
        yield put({
          type: 'updateState', payload: { varifyCode: result }
        });
      } else if (data === false) {
        const result = {
          value: varifyCode.value,
          inputMsg: '验证码错误',
          color: accentCinnabar,
          icon: 'close-circle-outline'
        };
        yield put({ type: 'updateState', payload: { varifyPassed: data } });
        yield put({
          type: 'updateState', payload: { varifyCode: result }
        });
      } else if (err) {
        const result = {
          value: varifyCode.value,
          inputMsg: err.message,
          color: accentCinnabar,
          icon: 'close-circle-outline'
        };
        yield put({
          type: 'updateState', payload: { varifyCode: result }
        });
      }
    },
    //put
  },
  subscriptions: {
  }
};
