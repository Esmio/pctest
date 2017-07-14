import _ from 'lodash';
import { apiRequest as request } from '../services';

const INITIAL_STATE = {
  awaitingResponse: false,
  orderHistory: [],
  orderInfo: '',
  state: 'ALL',
  subOrders: [],
  transactionTimeuuid: '',
};

export default {
	namespace: 'orderModel',
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
	},
	effects: {
    *getOrderHistory(payloadObj, { call, put, select }) {
      yield put({ type: 'updateState', payload: { awaitingResponse: true } });
      const { userModel, dataTableModel, orderModel } = yield select(state => state);
      const response = yield call(request.getOrderHistory, {
        userModel, dataTableModel, orderModel
      });
      const { data, err } = response;
      yield put({ type: 'updateState', payload: { awaitingResponse: false } });      
      if (data) {
        yield put({ type: 'updateState', payload: { orderHistory: data.datas } });
      } else if (err) {
        if (err.statusCode === '401') {
          yield put({
            type: 'userModel/secureAuthentication',
            payload: { msg: err.message }
          });
        } else {
          throw new Error(`无法获取购彩记录，${err.message}`);
        }
      }
    },
    *getOrderDetails({ payload }, { call, put, select }) {
      yield put({ type: 'updateState', payload: { awaitingResponse: true } });
      const { userModel, orderModel } = yield select(state => state);
      yield put({ type: 'storeUuid', payload });
      const response = yield call(request.getOrderDetails, userModel, orderModel);
      const { err, data } = response;
      if (data) {
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });
        yield put({ type: 'updateState', payload: { ...data } });
      } else if (err) {
        if (err.statusCode === '401') {
          yield put({
            type: 'userModel/secureAuthentication',
            payload: { msg: err.message }
          });
        } else {
          throw new Error(`无法获取订单详情, ${err.message}`);
        }
        yield put({ type: 'updateState', payload: { awaitingResponse: false } });
      }
    },
	}
};
