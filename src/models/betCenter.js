import _ from 'lodash';
import {
  apiRequest as request,
} from '../services';
import lessVar from '../styles/variables.less';

const { accentTeal, accentCinnabar } = lessVar;

const INITIAL_STATE = {
  allBetObj: {},
  allOpenOptions: {},
  amount: 0,
  amountUnit: 1,
  awaitingResponse: false,
  betEntries: [],
  current: '',
  gameMethod: '',
  initialAmount: 2,
  lastOpen: '',
  methodGroup: '',
  methodId: '',
  multiply: 1,
  gameNav: '',
  gameSubNav: '',
  numberOfUnits: 0,
  resultLimit: 20,
  repeatEntryIndex: '',
  responseColor: '',
  responseMessage: '',
  returnMoneyRatio: 0,
  thisBetObj: '',
  thisBetString: '',
  thisGameId: 'HF_CQSSC',
  thisMethodSetting: '',
  thisGameSetting: '',
  thisGamePrizeSetting: '',
  thisMethodPrizeSetting: '',
  thisOpenOption: '',
};

export default {
  namespace: 'betCenter',
  state: { ...INITIAL_STATE },
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
  },
  effects: {
    *getCurrentGameResult(payloadObj, { call, put, select }) {
      yield put({ type: 'updateState', payload: { awaitingResponse: true } });      
      const { betCenter } = yield select(state => state);
      const { thisGameId } = betCenter;
      const response = yield call(request.getCurrentResults, thisGameId);
      const { data, err } = response;
      yield put({ type: 'updateState', payload: { awaitingResponse: false } });      
      if (data) {
        const { current } = data;
        const { uniqueIssueNumber } = current;
        yield put({ type: 'updateState', payload: { ...data, uniqueIssueNumber } });
      } else if (err) {
        if (err.statusCode === '401') {
          yield put({
            type: 'userModel/secureAuthentication',
            payload: { msg: err.message }
          });
        } else {
          throw new Error(`无法获取当期开彩信息, ${err.message}`);
        }
      }
    },
    *postBetEntries(payloadObj, { call, put, select }) {
      yield put({ type: 'updateState', payload: { awaitingResponse: true } });
      const { betCenter, userModel } = yield select(state => state);
      let { betEntries } = betCenter;
      let totalAmount = 0;
      let totalUnits = 0;
      _.forEach(betEntries, (entry) => {
        const { amount, numberOfUnits } = entry;
        totalAmount += amount;
        totalUnits += numberOfUnits;
      });
      const { uniqueIssueNumber, thisGameId } = betCenter;
      const { accessToken } = userModel;
      const userSubmitTimestampMillis = +new Date();
      const drawIdentifier = {
        gameUniqueId: thisGameId, issueNum: `${uniqueIssueNumber}`
      };
      betEntries = _.map(betEntries, (entry) => {
        return _.pick(entry, [
            'amount', 'betString', 'gameplayMethod', 'numberOfUnits',
            'pricePerUnit', 'returnMoneyRatio'
        ]);
      });
      const order = {
        betEntries,
        drawIdentifier,
        numberOfUnits: totalUnits,
        purchaseInfo: {
					purchaseType: 'METHOD_UNDEFINED'
				},
        totalAmount,
        userSubmitTimestampMillis,
      };
      const response = yield call(request.postEntries, { order, accessToken });
      const { data, err } = response;
      yield put({ type: 'updateState', payload: { awaitingResponse: false } });
      if (data) {
        yield put({ type: 'initializeState', payload: ['betEntries'] });
        yield put({
          type: 'updateState',
          payload: {
            awaitingResponse: false,
            responseMessage: '投注成功祝您中奖',
            responseColor: accentTeal
          }
        });
      } else if (err) {
        if (err.statusCode === '401') {
          yield put({
            type: 'userModel/secureAuthentication',
            payload: { msg: err.message }
          });
        } else {
          yield put({
            type: 'updateState',
            payload: {
              responseMessage: err.message,
              responseColor: accentCinnabar
            }
          });
        }
      }
    }
  }
};
