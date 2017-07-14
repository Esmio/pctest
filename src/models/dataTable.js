import _ from 'lodash';
import moment from 'moment';
import { type as TYPE } from '../utils';

const INITIAL_STATE = {
  currentPage: 1,
  pageSize: 20,
  start: 0,
  dayCounts: 7,
  startTime: moment(new Date()).add(-7, 'days'),
  endTime: moment(new Date()),
  moneyOperationTypes: _.keys(TYPE.moneyOperationTypeRefs),
  targetUser: ''
};

export default {
  namespace: 'dataTableModel',
  state: INITIAL_STATE,
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    initializeState(state, { payload }) {
      const initialStates = _.pick(INITIAL_STATE, payload);
      return { ...state, ...initialStates };
    },
  },
  effects: {},
  subscriptions: {}
};
