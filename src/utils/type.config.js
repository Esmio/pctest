/* eslint-disable camelcase, quote-props */
import { numberGenerators } from './numberGenerators';
import { accentCinnabar, labelBlue, accentTeal } from '../styles/variables.less';

export const title = '亲';
export const SIG = 'c6Web';
export const username = `${SIG}:username`;
export const expiredTime = `${SIG}:expiredTime`;
export const accessToken = `${SIG}:accessToken`;
export const err204Msg = `${title}， 该请求成功，但没有返回任何内容`;
export const err400Msg = `${title}， 该请求服务器无法理解`;
export const err401Msg = `${title}， 该所请求的数据，未经授权`;
export const err403Msg = `${title}， 该请求被拒绝了`;
export const err404Msg = `${title}， 找不到该请求的数据`;
export const err429Msg = `${title}， 求过于频密，服务器有些繁忙`;
export const err500Msg = `${title}， 服务器遇到错误，无法完成请求`;
export const err504Msg = `${title}， 服务器超时，请稍后再试`;
export const COMBO_DUPLEX = 'combo_duplex';
export const DIRECT_COMBINE = 'combine_3';
export const DUPLEX = 'duplex';
export const GRAND_PRIZE = '头等奖';
export const GROUP_2 = 'group_2';
export const GROUP_3 = 'group_3';
export const GROUP_3__OPEN = 'group_3__open';
export const GROUP_6 = 'group_6';
export const GROUP_6__OPEN = 'group_6__open';
export const GROUP_PICK_12 = 'group_pick_12';
export const GROUP_PICK_12__OPEN = 'group_pick_12__open';
export const GROUP_PICK_24 = 'group_pick_24';
export const GROUP_PICK_24__OPEN = 'group_pick_24__open';
export const GROUP_PICK_4 = 'group_pick_4';
export const GROUP_PICK_4__OPEN = 'group_pick_4__open';
export const GROUP_PICK_6 = 'group_pick_6';
export const GROUP_PICK_6__OPEN = 'group_pick_6__open';
export const NORMAL = '普通';
export const SINGLE = 'single';
export const SUM = 'open_pick_sum';
export const SUM__OPEN = 'sum__open';
export const BUNDLING_THREE = 'bundling_three';
export const TOP_THREE_BET = 'top_three_bet';
export const TOP_TWO_BET = 'top_two_bet';
export const DIRECT_PICK_PULL_BET = 'direct_pick_pull_bet';
export const DIRECT_MULTIPLY = 'direct_multiply';

export const UNITS = {
  元: 1, 角: 0.1, 分: 0.01
};

// Symbolics
export const SYMBOLIC_SA_NOT_SET = 0;
export const SYMBOLIC_ZHU = '猪';
export const SYMBOLIC_GOU = '狗';
export const SYMBOLIC_JI = '鸡';
export const SYMBOLIC_HOU = '猴';
export const SYMBOLIC_YANG = '羊';
export const SYMBOLIC_MA = '马';
export const SYMBOLIC_SHE = '蛇';
export const SYMBOLIC_LONG = '龙';
export const SYMBOLIC_TU = '兔';
export const SYMBOLIC_HU = '虎';
export const SYMBOLIC_NIU = '牛';
export const SYMBOLIC_SHU = '鼠';
export const SYMBOLIC_TAIL0 = '0尾';
export const SYMBOLIC_CURRENT_YEAR = '当年肖';

// label sets
export const UNITS_W_Q_B_S_G = ['万位', '千位', '百位', '十位', '个位'];
export const UNITS_W_Q_B = ['万位', '千位', '百位'];
export const UNITS_B_S_G = ['百位', '十位', '个位'];
export const UNITS_W_Q = ['万位', '千位'];
export const UNITS_B_S = ['百位', '十位'];
export const UNITS_S_G = ['十位', '个位'];
export const UNITS_W = ['万位'];
export const PICK_NUM = ['选号'];
export const UNFIX = ['不定位'];
export const SUM_VALUES = ['和值'];
export const PICK_GROUP = ['组选'];
export const PICK_GROUP_24 = ['组选24'];
export const TRIPLE_SINGLE_NUM = ['二重号'];
export const DOUBLE_SINGLE_NUM = ['二重号', '单号'];
export const DOUBLE_NUM = ['三重号', '单号'];
export const TOP_ONE_RANK = ['冠军'];
export const TOP_TWO_RANK = ['冠军', '亚军'];
export const TOP_THREE_RANK = ['冠军', '亚军', '季军'];
export const ALL_RANK = ['冠军', '亚军', '季军', '第四名', '第五名', '第六名', '第七名', '第八名', '第九名', '第十名'];
export const DIRECT_PICK = ['胆拖'];
export const DIRECT_PICK_PULL = ['胆拖', '拖码'];
export const FIRST = ['首位'];
export const PUPOLAR_PICK = ['红投'];
export const FRONT_BACK = ['前位', '后位'];
export const GROUP_TWO = ['二连组'];
export const GROUP_THREE = ['三连组'];
export const TOP_THREE_PLACE = ['第一位', '第二位', '第三位'];
export const HAPPY_TWO = ['快乐二'];
export const HAPPY_THREE = ['快乐三'];
export const HAPPY_FOUR = ['快乐四'];
export const HAPPY_FIVE = ['快乐五'];
export const LEOPARD = ['豹子'];
export const CATEGORY = ['种类'];
export const COLOR_BALL = ['波色'];
export const BUNDLE_THREE = ['包三'];
export const SPECIAL_NUM = ['特码'];
export const MIX = ['混合'];
export const SAME_UNSAME = ['同号', '不同号'];
export const PICK_ALL = ['通选'];
export const NUM_ONE = ['一码'];
export const NUM_TWO = ['二码'];

// buttons sets
export const NUM_0_9 = numberGenerators.create({ length: 9 }).get();
export const NUM_1_6 = numberGenerators.create({ length: 6, start: 1 }).get();
export const NUM_0_18 = numberGenerators.create({ length: 18 }).get();
export const NUM_3_18 = numberGenerators.create({ length: 18, start: 3 }).get();
export const NUM_0_27 = numberGenerators.create({ length: 27 }).get();
export const NUM_1_26 = numberGenerators.create({ length: 26, start: 1 }).get();
export const NUM_3_24 = numberGenerators.create({ length: 24, start: 3 }).get();
export const LEADNUM_1_10 = numberGenerators.create({ length: 10, start: 1 }).getLeading();
export const LEADNUM_1_11 = numberGenerators.create({ length: 11, start: 1 }).getLeading();
export const LEADNUM_1_18 = numberGenerators.create({ length: 18, start: 1 }).getLeading();
export const LEADNUM_1_20 = numberGenerators.create({ length: 20, start: 1 }).getLeading();
export const LEADNUM_1_49 = numberGenerators.create({ length: 49, start: 1 }).getLeading();
export const LEADNUM_19_20 = numberGenerators.create({ length: 20, start: 19 }).get();
export const BSOE = ['大', '小', '单', '双'];
export const BS_DS_EXTEND = [...BSOE, '大单', '大双', '小单', '小双', '极大', '极小'];
export const MIX_TWO = ['红单', '红双', '红大', '红小', '蓝单', '蓝双', '蓝大', '蓝小', '绿单', '绿双', '绿大', '绿小'];
export const MIX_THREE = [
  '红大单', '红大双', '红小单', '红小双',
  '蓝大单', '蓝大双', '蓝小单', '蓝小双',
  '绿大单', '绿大双', '绿小单', '绿小双'
];
export const SPECIAL_SYMBOLICS = [
  '特大', '特小', '特尾大', '特尾小', '特单', '特双', '特大单', '特大双', '特合大', '特合小',
  '特小单', '特小双', '特合单', '特合双', '特天肖', '特地肖', '特前肖', '特后肖', '特家肖', '特野肖',
  '总大', '总小', '总单', '总双'
];
export const COLOR_THREE = ['红波', '蓝波', '绿波'];
export const COLOR_NUM = [
  {
    displayText: '红波',
    color: accentCinnabar,
    numberArrays: [
      '01', '02', '07', '08', '12',
      '13', '18', '19', '23', '24',
      '29', '30', '34', '35', '40',
      '45', '46'
    ]
  },
  {
    displayText: '蓝波',
    color: labelBlue,
    numberArrays: [
      '03', '04', '09', '10', '14',
      '15', '20', '25', '26', '31',
      '36', '37', '41', '42', '47',
      '48'
    ]
  },
  {
    displayText: '绿波',
    color: accentTeal,
    numberArrays: [
      '05', '06', '11', '16', '17',
      '21', '22', '27', '28', '32',
      '33', '38', '39', '43', '44',
      '49'
    ]
  },
];
export const SYMBOLICS = [
  SYMBOLIC_SHU, SYMBOLIC_NIU, SYMBOLIC_HU, SYMBOLIC_TU, SYMBOLIC_LONG, SYMBOLIC_SHE,
  SYMBOLIC_MA, SYMBOLIC_YANG, SYMBOLIC_HOU, SYMBOLIC_JI, SYMBOLIC_GOU, SYMBOLIC_ZHU
];
export const TOTAL_SYMBOLICS = [
  '2肖', '3肖', '4肖', '5肖', '6肖', '7肖', '总肖单', '总肖双'
];
export const TAIL_NUM = [
  '1尾', '2尾', '3尾', '4尾', '5尾', 
  '6尾', '7尾', '8尾', '9尾', '0尾', 
];
export const HEAD_TAIL_NUM = [
  '0头', '1头', '2头', '3头', '4头',
  '0尾', '1尾', '2尾', '3尾', '4尾',
  '5尾', '6尾', '7尾', '8尾', '9尾'
];
export const FIVE_ELEMENTS = ['金', '木', '水', '火', '土'];
export const DOUBLE_SAME_1_6 = ['11', '22', '33', '44', '55', '66'];
export const DOUBLE_SAME_1_6__SINGLE = ['1|1|*', '2|2|*', '3|3|*', '4|4|*', '5|5|*', '6|6|*'];
export const TRIPLE_SAME_1_6 = ['111', '222', '333', '444', '555', '666'];
export const OPEN_OPTION_STRINGS = {
  万位: 'W', 千位: 'Q', 百位: 'B', 十位: 'S', 个位: 'G'
};
export const TRIPLE_PICK_ALL = ['*|*|*'];

export const VALUE_REF = {
  R2Z_HZ: {
    0: 1,
    1: 2,
    2: 3,
    3: 4,
    4: 5,
    5: 6,
    6: 7,
    7: 8,
    8: 9,
    9: 10,
    10: 9,
    11: 8,
    12: 7,
    13: 6,
    14: 5,
    15: 4,
    16: 3,
    17: 2,
    18: 1
  },
  R2C_HZ: {
    0: 1,
    1: 1,
    2: 2,
    3: 2,
    4: 3,
    5: 3,
    6: 4,
    7: 4,
    8: 5,
    9: 5,
    10: 5,
    11: 4,
    12: 4,
    13: 3,
    14: 3,
    15: 2,
    16: 2,
    17: 1,
    18: 1
  },
  R3Z_HZ: {
    0: 1,
    1: 3,
    2: 6,
    3: 10,
    4: 15,
    5: 21,
    6: 28,
    7: 36,
    8: 45,
    9: 55,
    10: 63,
    11: 69,
    12: 73,
    13: 75,
    14: 75,
    15: 73,
    16: 69,
    17: 63,
    18: 55,
    19: 45,
    20: 36,
    21: 28,
    22: 21,
    23: 15,
    24: 10,
    25: 6,
    26: 3,
    27: 1
  },
  R3C_HZ: {
    0: 1,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 7,
    7: 8,
    8: 10,
    9: 12,
    10: 13,
    11: 14,
    12: 15,
    13: 15,
    14: 15,
    15: 15,
    16: 14,
    17: 13,
    18: 12,
    19: 10,
    20: 8,
    21: 7,
    22: 5,
    23: 4,
    24: 3,
    25: 2,
    26: 1,
    27: 1,
  },
  G3S: {
    1: 1,
    2: 2,
    3: 1,
    4: 3,
    5: 3,
    6: 3,
    7: 4,
    8: 5,
    9: 4,
    10: 5,
    11: 5,
    12: 4,
    13: 5,
    14: 5,
    15: 4,
    16: 5,
    17: 5,
    18: 4,
    19: 5,
    20: 4,
    21: 3,
    22: 3,
    23: 3,
    24: 1,
    25: 2,
    26: 1
  },
  G6S: {
    3: 1,
    4: 1,
    5: 2,
    6: 3,
    7: 4,
    8: 5,
    9: 7,
    10: 8,
    11: 9,
    12: 10,
    13: 10,
    14: 10,
    15: 10,
    16: 9,
    17: 8,
    18: 7,
    19: 5,
    20: 4,
    21: 3,
    22: 2,
    23: 1,
    24: 1
  }
};

VALUE_REF.NS3 = Object.assign({}, VALUE_REF.R3Z_HZ);
export const GUEST_REGISTER = '试玩';
export const REGISTER = '注册';
export const LOGIN = '登录';
export const PASSWORD = 'PASSWORD';
export const SECURITY_PASSWORD = 'SECURITY_PASSWORD';
export const withdrawal = '提款';
export const account = '账号';
export const user = '用户';
export const bank = '银行卡';
export const dateFormat = 'YYYY-MM-DD, HH:mm:ss';
export const inputFieldRefs = {
  affCode: '邀请码',
  affCodeStatus: '邀请码状态',
  affCodeUrl: '邀请码链接',
  bankAccountName: '银行卡开户姓名',
  bankAddress: '开户支行',
  bankCardNo: '银行卡号',
  bankCode: '银行代码',
  bankName: '开户银行',
  charge: '手续费',
  email: '电邮地址',
  identityNumber: '身份证号',
  newPassword: '新密码',
  nickname: '昵称',
  password: '密码',
  phoneNumber: '手机号码',
  prizeGroup: '奖金组',
  qq: 'QQ号',
  realName: '真实姓名',
  receiptName: '收款人姓名',
  remarks: '备注',
  repeatNewPassword: '确认新密码',
  repeatPassword: '确认密码',
  repeatSecurityPassword: '确认取款密码',
  securityPassword: '取款密码',
  topupAmount: '存款金额',
  topupCardRealname: '存款人姓名',
  topupCode: '充值码',
  topupDate: '存款日期',
  topupTime: '存款时间',
  transferAmount: '转账金额',
  transferToupType: '存款方式',
  username: '用户名',
  varifyCode: '验证码',
  withdrawalAmount: '提款金额',
};
export const moneyOperationTypeRefs = {
  BONUS: '优惠',
  CANC_BON: '取消优惠',
  CANC_FEE: '取消手续费',
  CANC_ORDER: '撤单',
  CANC_WD: '取消提现',
  CANC_WIN: '取消派彩',
  CHARGE: '购彩',
  COMMISSION: '返佣',
  FEE: '手续费',
  REBATE: '返水',
  TOPUP: '充值',
  TRANS_IN: '转入',
  TRANS_OUT: '转出',
  WIN: '中奖',
  WITHDRAW: '提现',
};
export const transactionStateRefs = {
  ALL: '全部',
  WIN: '中奖',
  LOSS: '未中奖',
  'WIN,LOSS': '已开奖',
  PENDING: '待开奖',
};
export const transferStateRefs = {
  ALL: '全部',
  INITIALIZED: '检测中',
  LOCK: '待审核',
  COMPLETED: '完成',
  CLOSE: '关闭',
  FAILED: '失败',
  AUTO_TOPUP_FAILED: '自动充值失败',
  IN_PROGRESS: '处理中',
  UNRECOGNIZED: '其他'
};
export const transferTypeRefs = {
  ALL: '全部',
  TOPUP: '充值',
  WITHDRAWAL: '提款',
  UNRECOGNIZED: '其他'
};
export const transferSubTypeRefs = {
  ALL: '全部',
  BANK_TRANSFER_TOPUP: '银行转账',
  BANK_TRANSFER_WITHDRAWAL: '银行转账',
  WECHAT_TOPUP: '微信',
  ALIPAY_TOPUP: '支付宝',
  THRIDPARTY_TOPUP: '代理',
  MANUAL_TOPUP: '其他',
  MANUAL_WITHDRAWAL: '其他',
  UNRECOGNIZED: '其他'
};
export const operatorTypeRefs = {
  TOPUP_PREFERENTIAL: '充值优惠',
  REGISTER_PREFERENTIAL: '注册优惠',
  WITHDRAWAL_ERROR: '出款错误',
  TOPUP_ERROR: '入款错误'
};
export const paymentTypeRefs = {
  ZHB: '支付宝',
  WX: '微信支付',
  THIRD_PARTY: '在线支付',
  BANK: '银行卡转账',
};
export const bankTransferTypeRefs = {
  BANK_ONLINE: '网银转账',
  BANK_ATM: 'ATM自动柜员机',
  BANK_ATM_CASH: 'ATM现金入款',
  BANK_COUNTER: '银行柜台转账',
  BANK_PHONE: '手机银行转账',
  WECHATPAY: '微信账号转账',
  ALIPAY: '支付宝账号转账',
  OTHER: '其他',
  UNRECOGNIZED: '未识别'
};
export const memberTypeRefs = {
  PLAYER: '会员',
  AGENT: '代理'
};
export const commissionStatusRefs = {
  ALL: '全部',
  INIT: '未发',
  COMPLETE: '已发'
};
export const timeframeRefs = [
  { displayText: '今天', dayCounts: 0 },
  { displayText: '一天', dayCounts: 1 },
  { displayText: '一周', dayCounts: 7 },
  { displayText: '两周', dayCounts: 15 },
  { displayText: '四周', dayCounts: 30 },  
];
export const userProfileNavs = {
  userCenter: [
    { navKey: 'basicInfo', displayName: '基本信息', icon: 'account-card-details' },
    { navKey: 'securityInfo', displayName: '修改密码', icon: 'account-key' },
    { navKey: 'bankCardInfo', displayName: '银行卡信息', icon: 'credit-card-plus', notForGuest: true },
    { navKey: 'topupCtrl', displayName: '充值', icon: 'bank', notForGuest: true },
    { navKey: 'withdrawalCtrl', displayName: '提款', icon: 'cash-multiple', notForGuest: true },
    { navKey: 'orderRecord', displayName: '投注记录', icon: 'ticket-confirmation' },
    {
      navKey: 'reports',
      displayName: '交易明细',
      icon: 'format-list-checks',
      subNavs: [
        { navKey: 'myCashFlow', displayName: '账户明细' },
        // { navKey: 'orderExpenses', displayName: '投注金额' },
        // { navKey: 'winningRecord', displayName: '奖金派送' },
        { navKey: 'topupRecord', displayName: '充值记录', notForGuest: true },
        { navKey: 'withdrawalRecord', displayName: '提款记录', notForGuest: true },
      ]
    }
  ],
  agentCenter: [
    { navKey: 'memberManage', displayName: '用户管理', icon: 'account-settings-variant' },
    { navKey: 'affCodeManage', displayName: '推广管理', icon: 'message-bulleted' },
    { navKey: 'commissionReport', displayName: '代理佣金', icon: 'clipboard-account' },
    { navKey: 'teamOverallReport', displayName: '团队报表', icon: 'account-network', disabled: true },
  ]
};

export const paymentAmounts = [
  50, 100, 300, 500, 1000, 2000, 3000, 5000
];

// 参考 http://tool.fxunion.com/SwiftCode.html
export const banksOptions = {
  zgyh: {
    displayName: '中国银行',
    cardNumberLength: 11,
    website: 'www.boc.cn'
  },
  zggs: {
    displayName: '工商银行',
    cardNumberLength: 11,
    website: 'www.icbc.com.cn'
  },
  nyyh: {
    displayName: '农业银行',
    cardNumberLength: 11,
    website: 'www.abchina.com'
  },
  jsyh: {
    displayName: '建设银行',
    cardNumberLength: 11,
    website: 'www.ccb.com'
  },
  jtyh: {
    displayName: '交通银行',
    cardNumberLength: 11,
    website: 'www.bankcomm.com'
  },
  zgyz: {
    displayName: '中国邮政',
    cardNumberLength: 11,
    website: 'www.psbc.com'
  },
  zxyh: {
    displayName: '中信银行',
    cardNumberLength: 11,
    website: 'www.citicbank.com'
  },
  gdyh: {
    displayName: '光大银行',
    cardNumberLength: 11,
    website: 'www.cebbank.com'
  },
  hxyh: {
    displayName: '华夏银行',
    cardNumberLength: 11,
    website: 'www.hxb.com.cn'
  },
  msyh: {
    displayName: '民生银行',
    cardNumberLength: 11,
    website: 'www.cmbc.com.cn'
  },
  gfyh: {
    displayName: '广发银行',
    cardNumberLength: 11,
    website: 'www.cgbchina.com.cn'
  },
  zgpa: {
    displayName: '平安银行',
    cardNumberLength: 11,
    website: 'bank.pingan.com'
  },
  zsyh: {
    displayName: '招商银行',
    cardNumberLength: 11,
    website: 'www.cmbchina.com'
  },
  pfyh: {
    displayName: '兴业银行',
    cardNumberLength: 11,
    website: 'www.cib.com.cn'
  },
  bhyh: {
    displayName: '浦发银行',
    cardNumberLength: 11,
    website: 'www.spdb.com.cn'
  },
  shyh: {
    displayName: '上海银行',
    cardNumberLength: 11,
    website: 'www.bankofshanghai.com'
  },
  bjyh: {
    displayName: '北京银行',
    cardNumberLength: 11,
    website: 'www.bankofbeijing.com.cn'
  },
  bjns: {
    displayName: '北京农商银行',
    cardNumberLength: 11,
    website: 'www.bjrcb.com'
  },
  shns: {
    displayName: '上海农商银行',
    cardNumberLength: 11,
    website: 'www.srcb.com'
  },
};
