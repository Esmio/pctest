import _ from 'lodash';
import { type } from '../utils/';
import {
  apiRequest as request, gameRules
} from '../services';

const INITIAL_STATE = {
	cart: {},
	existingBetAmount: {},
	existingMultiply: {},
	existingOpenOptions: {},
	existingPicks: {},
	existingPrizeAmount: {},
	existingReturnRatio: {},
	GameboardDoneLoading: false,
	gamePrize: null,
	largestPrizeAmount: 0,
	NavDoneLoading: false,
	navOptions: null,
	numberOfUnits: 0,
	selectedGameName: null,
	selectedGameSetting: null,
	selectedLotInfos: null,
	selectedLotResult: null,
	selectedLotSettings: null,
	selectedLotUniqueId: null,
	selectedNav: '',
	selectedSubNav: '',
	submissionFailed: false,
	submissionIsLoading: false,
	submissionSuccess: false,
	submitButtonClass: 'gamebaord_cartConfirmBtn__empty',
	submitButtonIcon: 'cart-outline',
	submitButtonText: '下注愉快',
	SubNavDoneLoading: false,
	subNavOptions: null,
	totalBetAmount: 0,
  availableSettings: null,
};
export default {
	namespace: 'playgroundModel',
	state: INITIAL_STATE,
	reducers: {
		updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    initializeState(state, { payload }) {
      const initialStates = _.pick(INITIAL_STATE, payload);
      return { ...state, ...initialStates };
    },
		putGameboardToLoading(state) {
			return { ...state, GameboardDoneLoading: false };
		},
		putNavToLoading(state) {
			return { ...state, NavDoneLoading: false };
		},
		putSubNavToLoading(state) {
			return { ...state, SubNavDoneLoading: false };
		},
		initializeSubmission(state) {
			const {
				submissionFailed,
				submissionIsLoading,
				submissionSuccess,
				submitButtonClass,
				submitButtonIcon,
				submitButtonText,
			} = INITIAL_STATE;
			return {
				...state,
				submissionFailed,
				submissionIsLoading,
				submissionSuccess,
				submitButtonClass,
				submitButtonIcon,
				submitButtonText,
			};
		},
		putSubmissionToLoading(state) {
			return {
				...state,
				submissionSuccess: false,
				submissionFailed: false,
				submissionIsLoading: true,
				submitButtonClass: 'gameboard_cartConfirmBtn__isLoading' };
		},
		putSubmissionToReady(state) {
			return {
				...state,
				submissionIsLoading: false,
				submissionSuccess: false,
				submissionFailed: false,
				submitButtonText: '立刻付款',
				submitButtonIcon: 'cart',
				submitButtonClass: 'gameboard_cartConfirmBtn'
			};
		},
		updateSingleInfoSuccess(state, { payload }) {
			const { key, value } = payload;
			return { ...state, [key]: value };
		},
		updateMultipleInfosSuccess(state, { payload }) {
			return { ...state, ...payload };
		},
		addPrizeAmount(state, { payload }) {
			const { existingPrizeAmount, selectedGameName } = state;
			const newPrizeAmount = { ...existingPrizeAmount };
			newPrizeAmount[selectedGameName] = payload;
			return { ...state, existingPrizeAmount: newPrizeAmount };
		},
		initializePlayground(state) {
			const {
				cart,
				navOptions,
				selectedGameName,
				selectedNav,
				subNavOptions,
				existingBetAmount,
				existingMultiply,
				existingOpenOptions,
				existingPicks,
				existingReturnRatio,
				existingPrizeAmount,
				GameboardIsPristine,
			} = INITIAL_STATE;
			return {
				...state,
				cart,
				navOptions,
				selectedGameName,
				selectedNav,
				subNavOptions,
				existingBetAmount,
				existingMultiply,
				existingOpenOptions,
				existingPicks,
				existingReturnRatio,
				existingPrizeAmount,
				GameboardIsPristine
			};
		},
		storeNavOptionsSuccess(state, { payload }) {
			// console.debug('storeNavOptionsSuccess', payload);
			const selectedNav = _.keys(payload)[0];
      const subNavOptions = payload[selectedNav];
			return {
				...state,
				navOptions: { ...payload },
				selectedNav,
				subNavOptions,
				NavDoneLoading: true,
				SubNavDoneLoading: true,
			};
		},
		selectSuccess(state, { payload }) {
			return {
				...state, ...payload, GameboardDoneLoading: true
			};
		},
		setInitialCalculateValue(state, { payload }) {
			const {
				existingBetAmount,
				existingMultiply,
				existingReturnRatio,
				existingPrizeAmount
			} = state;
			const newBetAmount = { ...existingBetAmount };
			const newMultiply = { ...existingMultiply };
			const newReturnRatio = { ...existingReturnRatio };
			const newPrizeAmount = { ...existingPrizeAmount };
			newBetAmount[payload] = newBetAmount[payload] || { ...type.initialBetAmount };
			newMultiply[payload] = newMultiply[payload] || 1;
			newReturnRatio[payload] = newReturnRatio[payload] || 0;
			newPrizeAmount[payload] = 0;
			return {
				...state,
				existingBetAmount: newBetAmount,
				existingMultiply: newMultiply,
				existingReturnRatio: newReturnRatio,
				exisitingPrizeAmount: newPrizeAmount
			};
		},
		addItemToCartSuccess(state, { payload }) {
			const { cart } = state;
			const newCart = [...cart];
			newCart.push(payload);
			// console.debug(newCart);
			return { ...state, cart: newCart };
		},
		submitCartSuccess(state) {
			return {
				...state,
				submissionSuccess: true,
				submissionFailed: false,
				submissionIsLoading: false,
				submitButtonIcon: 'thumb-up-outline',
				submitButtonText: '谢谢购彩，祝您中奖',
				submitButtonClass: 'gameboard_cartConfirmBtn__success'
			};
		},
		submitCartFailed(state, { payload }) {
			return {
				...state,
				submissionSuccess: false,
				submissionFailed: true,
				submissionIsLoading: false,
				submitButtonIcon: 'close-outline',
				submitButtonText: payload,
				submitButtonClass: 'gameboard_cartConfirmBtn__error'
			};
		}
	},
	effects: {
		*addOpenOptions({ payload }, { put, select }) {
			const { openOptions } = yield select(state => state.playgroundModel);
			const { gameName, value } = payload;
			const newPicks = yield gameRules.storeOpenOptions({
				gameName, value, openOptions
			});
			yield put({
				type: 'updateSingleInfoSuccess',
				payload: { key: 'existingBetAmount', value: newPicks }
			});
			yield put({ type: 'calculateBet' });
		},
		*addExistingPicks({ payload }, { put, select }) {
			const { existingPicks, selectedGameSetting } = yield select(state => state.playgroundModel);
			const { gameSetCombination } = selectedGameSetting;
			// console.debug(gameSetCombination);
			const { gameName, sectionName, value } = payload;
			const newPicks = yield gameRules.storeNewPicks({
				gameName, sectionName, value, existingPicks, gameSetCombination
			});
			yield put({
				type: 'updateSingleInfoSuccess',
				payload: { key: 'existingPicks', value: newPicks }
			});
			yield put({ type: 'calculateBet' });
		},
		*addRandomPicks({ payload }, { put, select }) {
			const {
				selectedGameSetting, existingPicks
			} = yield select(state => state.playgroundModel);
			const newPicks = { ...existingPicks };
			const { gameSetCombination } = selectedGameSetting;
			const { selectedGameName } = gameSetCombination;
			newPicks[selectedGameName] = yield gameRules.getRandomPicks(gameSetCombination);
			yield put({
				type: 'updateSingleInfoSuccess',
				payload: { key: 'existingPicks', value: newPicks }
			});
			yield put({ type: 'calculateBet' });
		},
		*addBetAmount({ payload }, { put, select }) {
			const { unit, amount } = payload;
			const { existingBetAmount, selectedGameName } = yield select(state => state.playgroundModel);
			const newBetAmount = { ...existingBetAmount };
			newBetAmount[selectedGameName][unit] = amount;
			yield put({
				type: 'updateSingleInfoSuccess',
				payload: { key: 'existingBetAmount', value: newBetAmount }
			});
			yield put({ type: 'calculateBet' });
		},
		*addMultiply({ payload }, { select, put }) {
			const {
				existingMultiply, selectedGameName
			} = yield select(state => state.playgroundModel);
			const newMultiply = { ...existingMultiply };
			newMultiply[selectedGameName] = newMultiply[selectedGameName];
			newMultiply[selectedGameName]++;
			yield put({
				type: 'updateSingleInfoSuccess',
				payload: { key: 'existingMultiply', value: newMultiply }
			});
			yield put({ type: 'calculateBet' });
		},
		*addReturnRatio({ payload }, { select, put }) {
			const {
				existingReturnRatio, selectedGameName
			} = yield select(state => state.playgroundModel);
			const newReturnRatio = { ...existingReturnRatio };
			newReturnRatio[selectedGameName] = payload;
			yield put({
				type: 'updateSingleInfoSuccess',
				payload: { key: 'existingReturnRatio', value: newReturnRatio }
			});
			yield put({ type: 'calculateBet' });
		},
		*addItemToCart({ payload }, { put, select }) {
			const {
				amount,
				existingMultiply,
				existingOpenOptions,
				existingPicks,
				existingReturnRatio,
				largestPrizeAmount,
				numberOfUnits,
				pricePerUnit,
				selectedGameName,
				selectedGameSetting,
			} = yield select(state => state.playgroundModel);
			const currentOpenOptions = existingOpenOptions[selectedGameName] || [];
			const currentPicks = existingPicks[selectedGameName];
			const betMultiply = existingMultiply[selectedGameName];
			const returnMoneyRatio = existingReturnRatio[selectedGameName];
			const { gameId, gameSetCombination } = selectedGameSetting;
			const displayString = yield gameRules.getDisplayString({
				currentPicks, gameSetCombination
			});
			let betString = displayString;
			if (currentOpenOptions.length) {
				const openOptionString = yield gameRules.getOpenOptionsString(currentOpenOptions);
				betString = `${openOptionString}:${betString}`;
			}
			const item = {
				gameName: selectedGameName,
				betMultiply,
				largestPrizeAmount,
				displayString,
				joinSectionWith: gameSetCombination.joinSectionWith || '|',
				order: {
					amount,
					betString,
					gameplayMethod: gameId,
					numberOfUnits,
					pricePerUnit,
					returnMoneyRatio
				}
			};
			yield put({ type: 'addItemToCartSuccess', payload: item });
			yield put({ type: 'calculateBet' });
		},
		*calculateBet({ payload }, { put, select }) {
			const playgroundModel = yield select(state => state.playgroundModel);
			const calculateDetails = yield gameRules.getCalculateDetails(playgroundModel);

			yield put({
				type: 'updateMultipleInfosSuccess',
				payload: calculateDetails
			});
		},
		*getSelectedLotResults({ payload }, { call, put, select }) {
			const { shouldInitialize, lotUniqueId } = payload;
			const { selectedGameName } = yield select(state => state.playgroundModel);
			const response = yield call(request.getCurrentResults.bind(this, lotUniqueId));
			const { data, err } = response;

			if (data) {
				yield put({
					type: 'updateSingleInfoSuccess',
					payload: { key: 'selectedLotResult', value: data }
				});
			} else if (err) {
				throw new Error(err.message);
			} else if (!err && !data) {
				console.debug('获取游戏成绩 payload', payload);
			}
			if (shouldInitialize) {
				yield put({ type: 'initializeGame', payload: selectedGameName });
				yield put({ type: 'clearCart' });
				yield put({ type: 'initializeSubmission' });
			}
		},
		*getSelectedLotInfos({ payload }, { put }) {
			yield put({ type: 'putNavToLoading' });
			yield put({ type: 'putSubNavToLoading' });
			yield put({ type: 'putGameboardToLoading' });
			yield put({ type: 'initializePlayground' });
			yield put({ type: 'initializeSubmission' });
			const { lotUniqueId, lotSettings, lotInfos } = payload;
			yield put({ type: 'updateMultipleInfosSuccess',
				payload: {
					selectedLotUniqueId: lotUniqueId,
					selectedLotSettings: lotSettings,
					selectedLotInfos: lotInfos,
				}
			});
			yield put({ type: 'storeNavOptions', payload: lotUniqueId });
			yield put({
				type: 'getSelectedLotResults',
				payload: { lotUniqueId }
			});
		},
		*storeNavOptions({ payload }, { put }) {
			const gameSettings = yield gameRules.getAllGameSettings({ selectedLotUniqueId: payload });
			const newNavOptions = yield gameRules.getNavOptions({ gameSettings });
			yield put({ type: 'storeNavOptionsSuccess', payload: newNavOptions });
		},
		*selectNav({ payload }, { put }) {
			yield put({ type: 'putGameboardToLoading' });
			const { selectedGameName, selectedGameSetting } = INITIAL_STATE;
			const { selectedNav, subNavOptions } = payload;
			yield put({
				type: 'selectSuccess',
				payload: {
					selectedGameName, selectedGameSetting, selectedNav, subNavOptions
				}
			});
		},
		*selectGame({ payload }, { put, select }) {
			yield put({ type: 'putGameboardToLoading' });
			const selectedGameName = payload;
			const {
				selectedLotSettings, selectedLotUniqueId, existingOpenOptions, cart
			} = yield select(state => state.playgroundModel);
			const selectedGameSetting = yield gameRules.getSingleGameSetting({
				selectedLotUniqueId, selectedGameName
			});
			const { gameSetCombination } = selectedGameSetting;
			const newOpenOptions = yield gameRules.getOpenOptions({
				existingOpenOptions,
				gameSetCombination,
				gameName: selectedGameName
			});
			const gamePrize = yield gameRules.extractGamePrize(selectedLotSettings, selectedGameSetting);
			yield put({ type: 'setInitialCalculateValue', payload: selectedGameName });
			yield put({
				type: 'selectSuccess',
				payload: {
				selectedGameName,
        selectedGameSetting,
				existingOpenOptions: newOpenOptions,
        gamePrize
				}
			});
			yield put({ type: 'calculateBet' });
			if (cart.length < 1) {
				yield put({ type: 'initializeSubmission' });
			}
			if (cart.length >= 1) {
				yield put({ type: 'putSubmissionToReady' });
			}
		},
		*initializeGame({ payload }, { put, select }) {
			const {
				existingPicks,
				existingBetAmount,
				existingMultiply,
				existingReturnRatio,
				existingPrizeAmount
			} = yield select(state => state.playgroundModel);
			const newPicks = { ...existingPicks };
			const newBetAmount = { ...existingBetAmount };
			const newMultiply = { ...existingMultiply };
			const newReturnRatio = { ...existingReturnRatio };
			const newPrizeAmount = { ...existingPrizeAmount };
			if (newPicks[payload]) {
				delete newPicks[payload];
			}
			newBetAmount[payload] = { ...type.initialBetAmount };
			newMultiply[payload] = 1;
			newReturnRatio[payload] = 0;
			newPrizeAmount[payload] = 0;

			yield put({
				type: 'updateMultipleInfosSuccess',
				payload: {
					existingPicks: newPicks,
					existingBetAmount: newBetAmount,
					existingMultiply: newMultiply,
					existingReturnRatio: newReturnRatio,
					exisitingPrizeAmount: newPrizeAmount
				}
			});
			yield put({ type: 'calculateBet' });
		},
		*removeCartItem({ payload }, { put, select }) {
			const { cart } = yield select(state => state.playgroundModel);
			const newCart = [...cart];
			newCart.splice(payload, 1);
			yield put({
				type: 'updateSingleInfoSuccess',
				payload: { key: 'cart', value: newCart }
			});
			if (newCart.length < 1) {
				yield put({ type: 'initializeSubmission' });
			} else if (newCart.length >= 1) {
				yield put({ type: 'putSubmissionToReady' });
			}
		},
		*clearCart({ payload }, { put }) {
			yield put({
				type: 'updateSingleInfoSuccess',
				payload: { key: 'cart', value: [] }
			});
			yield put({ type: 'initializeSubmission' });
		},
		*submitCart({ payload }, { put, call, select }) {
			const {
				cart, selectedLotUniqueId, selectedLotResult, selectedGameName
			} = yield select(state => state.playgroundModel);
			const { accessToken } = yield select(state => state.userModel);
			const { current } = selectedLotResult;
			const { uniqueIssueNumber } = current;
			const betDetails = gameRules.getBetDetails(cart);
			const { betEntries, totalAmount, totalNumberOfUnits } = betDetails;
			const order = {
				betEntries,
				drawIdentifier: {
					gameUniqueId: selectedLotUniqueId,
					issueNum: `${uniqueIssueNumber}`
				},
				numberOfUnits: totalNumberOfUnits,
				purchaseInfo: {
					purchaseType: 'METHOD_UNDEFINED'
				},
				totalAmount,
				userSubmitTimestampMillis: +new Date()
			};

			const response = yield call(request.putOrder.bind(this, { order, accessToken }));
			const { data, err } = response;

			if (data) {
				yield put({ type: 'submitCartSuccess' });
				yield put({ type: 'initializeGame', payload: selectedGameName });
				yield put({
					type: 'updateSingleInfoSuccess',
					payload: { key: 'cart', value: [] }
				});
			} else if (err.status === 401) {
				yield put({ type: 'submitCartFailed', payload: '请先登入，再进行投注' });
			} else if (err) {
				yield put({ type: 'submitCartFailed', payload: err.message });
			} else {
				yield put({ type: 'submitCartFailed', payload: '投注异常，请联系客服' });
				console.error('投注异常', order);
			}
		}
	},
	subscriptions: {
	}
};
