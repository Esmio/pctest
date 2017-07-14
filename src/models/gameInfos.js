import { message } from 'antd';
import {
  apiRequest as request
} from '../services';

const INITIAL_STATE = {
  allHistory: '',
	awaitingResponse: false,
	thisGameHistory: '',
	allGamesPrizeSettings: '',
	announcement: '',
	announcements: '',
	gameInfosHot: '',
	gameInfosRecommend: '',
	generalContents: '',
	menuIcons: '',
	promotionBanners: '',
  selectedGame: 'HF_CQSSC',
};

export default {
	namespace: 'gameInfosModel',
	state: INITIAL_STATE,
	reducers: {
		updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    initializeState(state, { payload }) {
      const initialStates = _.pick(INITIAL_STATE, payload);
      return { ...state, ...initialStates };
    }
	},
	effects: {
		*getHomepageInfo(payload, { call, put }) {
			const response = yield call(request.getHomepageInfo);
			const { data, err } = response;
      if (data) {
        yield put({ type: 'updateState', payload: { ...data } });
      } else if (err) {
        message.error(`${err.message}`);
			} else if (!err && !data) {
        console.debug('获取首页质询 payload', payload);
      }
		},
		*getAllHistory(payload, { call, put }) {
			const response = yield call(request.getAllHistory);
			const { data, err } = response;
			if (data) {
				yield put({ type: 'updateState', payload: { allHistory: data } });
			} else if (err) {
				throw new Error(`无法获取开奖结果 ${err.message}`);
			}
		},
		*getThisGameHistory(payloadObj, { call, put, select }) {
      yield put({ type: 'updateState', payload: { awaitingResponse: true } });
      const { betCenter } = yield select(state => state);
      const response = yield call(request.getThisGameHistory, betCenter);
      const { data, err } = response;
      yield put({ type: 'updateState', payload: { awaitingResponse: false } });
      if (data) {
        yield put({ type: 'updateState', payload: { thisGameHistory: data } });
      } else if (err) {
        throw new Error(`无法获取该开彩信息, ${err.message}`);
      }
    },
		*getAllGamesSetting(payload, { call, put, select }) {
			const { userModel } = yield select(state => state);
			const { userData } = userModel;
			let prizeGroup = 1960;
			if (userData) prizeGroup = userData.prizeGroup;
			const response = yield call(request.getAllGamesSetting, prizeGroup);
			const { data, err } = response;
			if (data) {
				const { allGamesPrizeSettings } = data;
				yield put({ type: 'updateState', payload: { allGamesPrizeSettings } });
			} else if (err) {
				throw new Error(`无法获取购彩信息 ${err.message}`);
			}
		},
	},
	subscriptions: {
		setup({ history, dispatch }) {
			return history.listen(({ pathname, query }) => {
				if (pathname === '/history') {
					dispatch({ type: 'getAllHistory' });

					if (query && query.gameUniqueId) {
						const { gameUniqueId } = query;
						dispatch({ type: 'betCenter/updateState', payload: { thisGameId: gameUniqueId } });
						dispatch({ type: 'getThisGameHistory' });
					} else {
						dispatch({ type: 'betCenter/initializeState', payload: ['thisGameId', 'resultLimit'] });
						dispatch({ type: 'initializeState', payload: ['thisGameHistory'] });
					}
				}
			});
		}
	}
};
