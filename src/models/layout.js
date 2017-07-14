const INITIAL_STATE = {
  iosAppLink: 'https://www.google.com',
  androidAppLink: 'https://www.baidu.com',
  qrDisplay: 'ios',
  activeTab: '',
  shouldShowProfileModal: false,
  shouldShowAuthModel: false,
  profileGroupNav: '我的信息',
  profileSelectedNav: 'basicInfo'
};

export default {
  namespace: 'layoutModel',
  state: INITIAL_STATE,
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    initializeState(state, { payload }) {
      const initialState = _.pick(INITIAL_STATE, payload);
      return { ...state, ...initialState };
    },
    setActiveTab(state, { payload }) {
      return { ...state, activeTab: payload };
    },
    overwriteSideNav(state, { payload }) {
      return { ...state, sideNavIsLocked: payload };
    },
    setSideNavVisibility(state, { payload }) {
      return { ...state, shouldShowSideNav: payload };
    },
    toggleForm(state, { payload }) {
      const { target, isExpanded } = payload;
      return { ...state, [`${target}InfoFormExpanded`]: isExpanded };
    },
    lockForm(state, { payload }) {
      const { target, isLock } = payload;
      return { ...state, [`${target}InfoFormIsLocked`]: isLock };
    },
    selectUserProfileNav(state, { payload }) {
      return { ...state, userProfileSelectedNav: payload };
    }
  },
  effects: {
  },
  subscriptions: {
  }
};
