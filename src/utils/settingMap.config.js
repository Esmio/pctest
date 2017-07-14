/* eslint-disable quote-props, max-len, object-property-newline */
import * as type from '../utils/type.config';

/**
 * Created by Sam on 2016/12/28.
 * Copyright © 2016年 JX. All rights reserved.
 */

export const gamesMap = [
	{ gameSettingsMap: 'BJPK10', gameUniqueId: 'HF_BJPK10', gameNameInChinese: '北京PK10' },
	{ gameSettingsMap: 'BJPK10', gameUniqueId: 'HF_LFPK10', gameNameInChinese: '二分PK拾' },
	{ gameSettingsMap: 'D11X5', gameUniqueId: 'HF_AHD11', gameNameInChinese: '安徽11选5' },
	{ gameSettingsMap: 'D11X5', gameUniqueId: 'HF_GDD11', gameNameInChinese: '广东11选5' },
	{ gameSettingsMap: 'D11X5', gameUniqueId: 'HF_JXD11', gameNameInChinese: '江西11选5' },
	{ gameSettingsMap: 'D11X5', gameUniqueId: 'HF_LFD11', gameNameInChinese: '二分11选5' },
	{ gameSettingsMap: 'D11X5', gameUniqueId: 'HF_SDD11', gameNameInChinese: '山东11选5' },
	{ gameSettingsMap: 'D11X5', gameUniqueId: 'HF_SG28', gameNameInChinese: '新加坡28' },
	{ gameSettingsMap: 'D11X5', gameUniqueId: 'HF_SHD11', gameNameInChinese: '上海11选5' },
	{ gameSettingsMap: 'D3', gameUniqueId: 'X3D', gameNameInChinese: '福彩3D' },
	{ gameSettingsMap: 'PCDD', gameUniqueId: 'HF_LF28', gameNameInChinese: '幸运28' },
	{ gameSettingsMap: 'PCDD', gameUniqueId: 'HF_BJ28', gameNameInChinese: '北京28' },
	{ gameSettingsMap: 'K3', gameUniqueId: 'HF_AHK3', gameNameInChinese: '安徽快3' },
	{ gameSettingsMap: 'K3', gameUniqueId: 'HF_GXK3', gameNameInChinese: '广西快3' },
	{ gameSettingsMap: 'K3', gameUniqueId: 'HF_JSK3', gameNameInChinese: '江苏快3' },
	{ gameSettingsMap: 'KL10F', gameUniqueId: 'HF_CQKL10F', gameNameInChinese: '重庆快乐十分' },
	{ gameSettingsMap: 'KL10F', gameUniqueId: 'HF_GDKL10F', gameNameInChinese: '广东快乐十分' },
	{ gameSettingsMap: 'KL10F', gameUniqueId: 'HF_TJKL10F', gameNameInChinese: '天津快乐十分' },
	{ gameSettingsMap: 'MarkSix', gameUniqueId: 'MARK_SIX', gameNameInChinese: '六合彩' },
	{ gameSettingsMap: 'PK', gameUniqueId: 'HF_KLPK', gameNameInChinese: '幸运扑克' },
	{ gameSettingsMap: 'PL', gameUniqueId: 'PL3', gameNameInChinese: '排列3' },
	{ gameSettingsMap: 'SSC', gameUniqueId: 'HF_CQSSC', gameNameInChinese: '重庆时时彩' },
	{ gameSettingsMap: 'SSC', gameUniqueId: 'HF_JXSSC', gameNameInChinese: '江西时时彩' },
	{ gameSettingsMap: 'SSC', gameUniqueId: 'HF_LFSSC', gameNameInChinese: '二分时时彩' },
	{ gameSettingsMap: 'SSC', gameUniqueId: 'HF_TJSSC', gameNameInChinese: '天津时时彩' },
	{ gameSettingsMap: 'SSC', gameUniqueId: 'HF_XJSSC', gameNameInChinese: '新疆时时彩' },
	{ gameSettingsMap: 'SSL', gameUniqueId: 'HF_SHSSL', gameNameInChinese: '上海时时乐' },
];

export const gameSettingsMap = {
	BJPK10: [
		{
			gameMethod: '定位胆', methodId: 'DN',
			gameRules: {
				sections: type.ALL_RANK, set: [type.LEADNUM_1_10],
				formula: type.SINGLE,
				minimumRowPick: 1,
				pickRange: [
					'1-10', '1-10', '1-10', '1-10', '1-10',
					'1-10', '1-10', '1-10', '1-10', '1-10'
				]
			}
		},
		{
			gameMethod: '前一', methodId: 'D1',
			gameRules: {
				sections: type.TOP_ONE_RANK, set: [type.LEADNUM_1_10],
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-10']
			}
		},
		{
			gameMethod: '前二', methodId: 'GT2',
			gameRules: {
				sections: type.TOP_TWO_RANK, set: [type.LEADNUM_1_10], isUnique: true,
				formula: type.TOP_TWO_BET, minimumRowPick: 2, pickRange: ['1-10', '1-10']
			}
		},
		{
			gameMethod: '前三', methodId: 'GT3',
			gameRules: {
				sections: type.TOP_THREE_RANK, set: [type.LEADNUM_1_10], isUnique: true,
				formula: type.TOP_THREE_BET, minimumRowPick: 3, pickRange: ['1-10', '1-10', '1-10']
			}
		},
	],
	D11X5: [
		{
			gameMethod: '直选-前一直选', methodId: 'Q1Z',
			gameRules: {
				sections: type.UNITS_W, set: [type.LEADNUM_1_11], isUnique: true,
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-11']
			}
		},
		{
			gameMethod: '直选-前二直选', methodId: 'Q2Z',
			gameRules: {
				sections: type.UNITS_W_Q, set: [type.LEADNUM_1_11], isUnique: true,
				formula: type.TOP_TWO_BET, minimumRowPick: 2, pickRange: ['1-11', '1-11']
			}
		},
		{
			gameMethod: '直选-前三直选', methodId: 'Q3Z',
			gameRules: {
				sections: type.UNITS_W_Q_B, set: [type.LEADNUM_1_11], isUnique: true,
				formula: type.TOP_THREE_BET, minimumRowPick: 3, pickRange: ['1-11', '1-11', '1-11']
			}
		},
		{
			gameMethod: '组选-前二组选', methodId: 'Q2C',
			gameRules: {
				sections: type.PICK_NUM, set: [type.LEADNUM_1_11],
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['2-11']
			}
		},
		{
			gameMethod: '组选-前三组选', methodId: 'Q3C',
			gameRules: {
				sections: type.PICK_NUM, set: [type.LEADNUM_1_11],
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['3-11']
			}
		},
		{
			gameMethod: '组选-前二组选胆拖', methodId: 'Q2CDT',
			gameRules: {
				sections: type.DIRECT_PICK_PULL, set: [type.LEADNUM_1_11], isUnique: true, uniqueInt: 2,
				formula: type.DIRECT_PICK_PULL_BET, minimumRowPick: 2, pickRange: ['1-1', '1-11']
			}
		},
		{
			gameMethod: '组选-前三组选胆拖', methodId: 'Q3CDT',
			gameRules: {
				sections: type.DIRECT_PICK_PULL, set: [type.LEADNUM_1_11], isUnique: true, uniqueInt: 3,
				formula: type.DIRECT_PICK_PULL_BET, minimumRowPick: 2, pickRange: ['2-2', '1-11']
			}
		},
		{
			gameMethod: '任选-任选二', methodId: 'R2',
			gameRules: {
				sections: type.PICK_NUM, set: [type.LEADNUM_1_11],
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['2-11']
			}
		},
		{
			gameMethod: '任选-任选二胆拖', methodId: 'R2DT',
			gameRules: {
				sections: type.DIRECT_PICK_PULL, set: [type.LEADNUM_1_11], isUnique: true, uniqueInt: 2,
				formula: type.DIRECT_PICK_PULL_BET, minimumRowPick: 2, pickRange: ['1-1', '1-11']
			}
		},
		{
			gameMethod: '任选-任选三', methodId: 'R3',
			gameRules: {
				sections: type.PICK_NUM, set: [type.LEADNUM_1_11],
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['3-11']
			}
		},
		{
			gameMethod: '任选-任选三胆拖', methodId: 'R3DT',
			gameRules: {
				sections: type.DIRECT_PICK_PULL, set: [type.LEADNUM_1_11], isUnique: true, uniqueInt: 3,
				formula: type.DIRECT_PICK_PULL_BET, minimumRowPick: 2, pickRange: ['2-2', '1-11']
			}
		},
		{
			gameMethod: '任选-任选四', methodId: 'R4',
			gameRules: {
				sections: type.PICK_NUM, set: [type.LEADNUM_1_11],
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['4-11']
			}
		},
		{
			gameMethod: '任选-任选四胆拖', methodId: 'R4DT',
			gameRules: {
				sections: type.DIRECT_PICK_PULL, set: [type.LEADNUM_1_11], isUnique: true, uniqueInt: 4,
				formula: type.DIRECT_PICK_PULL_BET, minimumRowPick: 2, pickRange: ['3-3', '1-11']
			}
		},
		{
			gameMethod: '任选-任选五', methodId: 'R5',
			gameRules: {
				sections: type.PICK_NUM, set: [type.LEADNUM_1_11],
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['5-11']
			}
		},
		{
			gameMethod: '任选-任选五胆拖', methodId: 'R5DT',
			gameRules: {
				sections: type.DIRECT_PICK_PULL, set: [type.LEADNUM_1_11], isUnique: true, uniqueInt: 5,
				formula: type.DIRECT_PICK_PULL_BET, minimumRowPick: 2, pickRange: ['4-4', '1-11']
			}
		},
		{
			gameMethod: '任选-任选六', methodId: 'R6',
			gameRules: {
				sections: type.PICK_NUM, set: [type.LEADNUM_1_11],
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['6-11']
			}
		},
		{
			gameMethod: '任选-任选六胆拖', methodId: 'R6DT',
			gameRules: {
				sections: type.DIRECT_PICK_PULL, set: [type.LEADNUM_1_11], isUnique: true, uniqueInt: 6,
				formula: type.DIRECT_PICK_PULL_BET, minimumRowPick: 2, pickRange: ['5-5', '1-11']
			}
		},
		{
			gameMethod: '任选-任选七', methodId: 'R7',
			gameRules: {
				sections: type.PICK_NUM, set: [type.LEADNUM_1_11],
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['7-11']
			}
		},
		{
			gameMethod: '任选-任选七胆拖', methodId: 'R7DT',
			gameRules: {
				sections: type.DIRECT_PICK_PULL, set: [type.LEADNUM_1_11], isUnique: true, uniqueInt: 7,
				formula: type.DIRECT_PICK_PULL_BET, minimumRowPick: 2, pickRange: ['6-6', '1-11']
			}
		},
		{
			gameMethod: '任选-任选八', methodId: 'R8',
			gameRules: {
				sections: type.PICK_NUM, set: [type.LEADNUM_1_11],
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['8-11']
			}
		},
		{
			gameMethod: '任选-任选八胆拖', methodId: 'R8DT',
			gameRules: {
				sections: type.DIRECT_PICK_PULL, set: [type.LEADNUM_1_11], isUnique: true, uniqueInt: 8,
				formula: type.DIRECT_PICK_PULL_BET, minimumRowPick: 2, pickRange: ['7-7', '1-11']
			}
		},
	],
	D3: [
		{
			gameMethod: '定位胆', methodId: 'SP',
			gameRules: {
				sections: type.UNITS_B_S_G, set: [type.NUM_0_9],
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10', '1-10', '1-10']
			}
		},
		{
			gameMethod: '不定位-一码不定位', methodId: 'NS1P',
			gameRules: {
				sections: type.UNFIX, set: [type.NUM_0_9],
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10']
			}
		},
		{
			gameMethod: '不定位-二码不定位', methodId: 'NS2P', 
			gameRules: {
				sections: type.UNFIX, set: [type.NUM_0_9], uniqueInt: 2,
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['1-10']
			}
		},
		{
			gameMethod: '三星-组三复式', methodId: 'GRP3',
			gameRules: {
				sections: type.PICK_NUM, set: [type.NUM_0_9],
				formula: type.GROUP_3, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		{
			gameMethod: '三星-组六复式', methodId: 'GRP6',
			gameRules: {
				sections: type.PICK_NUM, set: [type.NUM_0_9],
				formula: type.GROUP_6, minimumRowPick: 1, pickRange: ['3-10']
			}
		},
		{
			gameMethod: '三星-组六和值', methodId: 'G6S',
			gameRules: {
				sections: type.SUM_VALUES, set: [type.NUM_3_24],
				formula: type.SUM, minimumRowPick: 1, pickRange: ['1-22'],
			}
		},
		{
			gameMethod: '三星-组三和值', methodId: 'G3S',
			gameRules: {
				sections: type.SUM_VALUES, set: [type.NUM_1_26],
				formula: type.SUM, minimumRowPick: 1, pickRange: ['1-26'],
			}
		},
		{
			gameMethod: '三星-直选复式', methodId: 'NIO3',
			gameRules: {
				sections: type.UNITS_B_S_G, set: [type.NUM_0_9],
				formula: type.DUPLEX, minimumRowPick: 3, pickRange: ['1-10', '1-10', '1-10']
			}
		},
		{
			gameMethod: '三星-直选和值', methodId: 'NS3',
			gameRules: {
				sections: type.SUM_VALUES, set: [type.NUM_0_27],
				formula: type.SUM, minimumRowPick: 1, pickRange: ['1-28'],
			}
		},
		{
			gameMethod: '二星-前二直选', methodId: 'F2IO',
			gameRules: {
				sections: type.UNITS_B_S, set: [type.NUM_0_9],
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-10', '1-10']
			}
		},
		{
			gameMethod: '二星-前二组选', methodId: 'F2',
			gameRules: {
				sections: type.PICK_NUM, set: [type.NUM_0_9], uniqueInt: 2,
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		{
			gameMethod: '二星-后二直选', methodId: 'L2IO',
			gameRules: {
				sections: type.UNITS_S_G, set: [type.NUM_0_9],
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-10', '1-10']
			}
		},
		{
			gameMethod: '二星-后二组选', methodId: 'L2',
			gameRules: {
				sections: type.PICK_NUM, set: [type.NUM_0_9], uniqueInt: 2,
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		{
			gameMethod: '大小单双-后二大小单双', methodId: 'L2BSOE',
			gameRules: {
				sections: type.UNITS_S_G, set: [type.BSOE],
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-4', '1-4']
			}
		},
		{
			gameMethod: '大小单双-前二大小单双', methodId: 'F2BSOE',
			gameRules: {
				sections: type.UNITS_B_S, set: [type.BSOE],
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-4', '1-4']
			}
		},
	],
	PCDD: [
		{
			gameMethod: '混合', methodId: 'MIX',
			gameRules: {
				sections: type.MIX, set: [type.BS_DS_EXTEND],
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10']
			}
		},
		{
			gameMethod: '特码', methodId: 'SP',
			gameRules: {
				sections: type.SPECIAL_NUM, set: [type.NUM_0_27],
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-28']
			}
		},
		{
			gameMethod: '特码-特码包三', methodId: 'SP3',
			gameRules: {
				sections: type.BUNDLE_THREE, set: [type.NUM_0_27], isUnique: true,
				formula: type.BUNDLING_THREE, minimumRowPick: 1, pickRange: ['3-3']
			}
		},
		{
			gameMethod: '波色', methodId: 'BS',
			gameRules: {
				sections: type.COLOR_BALL, set: [type.COLOR_THREE],
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-3']
			}
		},
		{
			gameMethod: '豹子', methodId: 'BZ',
			gameRules: {
				sections: type.LEOPARD, set: [type.LEOPARD],
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-1']
			}
		}
	],
	K3: [
		{
			gameMethod: '和值', methodId: 'HZ',
			gameRules: {
				sections: type.SUM_VALUES, set: [type.NUM_3_18],
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-16']
			}
		},
		{
			gameMethod: '猜一个号', methodId: 'CYG',
			gameRules: {
				sections: type.PICK_NUM, set: [type.NUM_1_6], uniqueInt: 21,
				formula: type.DIRECT_MULTIPLY, minimumRowPick: 1, pickRange: ['1-6']
			}
		},
		{
			gameMethod: '二不同号', methodId: 'EBTH',
			gameRules: {
				sections: type.PICK_NUM, set: [type.NUM_1_6],
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['2-6']
			}
		},
		{
			gameMethod: '二不同号-二不同号胆拖', methodId: 'EBTHDT',
			gameRules: {
				sections: type.DIRECT_PICK_PULL, set: [type.NUM_1_6], isUnique: true, uniqueInt: 2,
				formula: type.DIRECT_PICK_PULL_BET, minimumRowPick: 2, pickRange: ['1-1', '1-6'],
			}
		},
		{
			gameMethod: '二同号-二同号单选', methodId: 'ETHDX',
			gameRules: {
				sections: type.SAME_UNSAME, set: [type.DOUBLE_SAME_1_6, type.NUM_1_6],
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-6', '1-6'], isUnique: true,
			}
		},
		{
			gameMethod: '二同号-二同号复选', methodId: 'ETHFX',
			gameRules: {
				sections: type.PICK_NUM, set: [type.DOUBLE_SAME_1_6__SINGLE],
				joinPickWith: [','], joinSectionWith: ',',
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-6']
			}
		},
		{
			gameMethod: '三不同号', methodId: 'SBTH',
			gameRules: {
				sections: type.PICK_NUM, set: [type.NUM_1_6],
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['3-6']
			}
		},
		{
			gameMethod: '三同号-三同号单选', methodId: 'STHDX',
			gameRules: {
				sections: type.PICK_NUM, set: [type.TRIPLE_SAME_1_6],
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-6']
			}
		},
		{
			gameMethod: '三同号-三同号通选', methodId: 'STHTX',
			gameRules: {
				sections: type.PICK_ALL, set: [type.TRIPLE_PICK_ALL],
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-1']
			}
		},
		{
			gameMethod: '三连号-三连号通选', methodId: 'SLHTX',
			gameRules: {
				sections: type.PICK_ALL, set: [type.TRIPLE_PICK_ALL],
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-1']
			}
		},
	],
	KL10F: [
		{
			gameMethod: '首位-首位数投', methodId: 'ST1',
			gameRules: {
				sections: type.FIRST, set: [type.LEADNUM_1_18],
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-18']
			}
		},
		{
			gameMethod: '首位-首位红投', methodId: 'RT1',
			gameRules: {
				sections: type.PUPOLAR_PICK, set: [type.LEADNUM_19_20],
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-2']
			}
		},

		{
			gameMethod: '二连-二连直', methodId: 'DC2',
			gameRules: {
				sections: type.FRONT_BACK, set: [type.LEADNUM_1_20], isUnique: true,
				formula: type.TOP_TWO_BET, minimumRowPick: 2, pickRange: ['1-20', '1-20']
			}
		},
		{
			gameMethod: '二连-二连组', methodId: 'CC2',
			gameRules: {
				sections: type.GROUP_TWO, set: [type.LEADNUM_1_20],
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['2-20']
			}
		},

		{
			gameMethod: '前三-前三直', methodId: 'DT3',
			gameRules: {
				sections: type.TOP_THREE_PLACE, set: [type.LEADNUM_1_20], isUnique: true,
				formula: type.TOP_THREE_BET, minimumRowPick: 3, pickRange: ['1-20', '1-20', '1-20']
			}
		},
		{
			gameMethod: '前三-前三组', methodId: 'CT3',
			gameRules: {
				sections: type.GROUP_THREE, set: [type.LEADNUM_1_20],
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['3-20']
			}
		},
		{
			gameMethod: '快乐-快乐二', methodId: 'KL2',
			gameRules: {
				sections: type.HAPPY_TWO, set: [type.LEADNUM_1_20],
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['2-20']
			}
		},
		{
			gameMethod: '快乐-快乐三', methodId: 'KL3',
			gameRules: {
				sections: type.HAPPY_THREE, set: [type.LEADNUM_1_20],
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['3-20']
			}
		},
		{
			gameMethod: '快乐-快乐四', methodId: 'KL4',
			gameRules: {
				sections: type.HAPPY_FOUR, set: [type.LEADNUM_1_20],
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['4-20']
			}
		},
		{
			gameMethod: '快乐-快乐五', methodId: 'KL5',
			gameRules: {
				sections: type.HAPPY_FIVE, set: [type.LEADNUM_1_20],
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['5-20']
			}
		}
	],
	MarkSix: [
		{
			gameMethod: '特码-特码A', methodId: 'SA',
			gameRules: {
				sections: type.PICK_NUM, set: [type.LEADNUM_1_49],
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-49']
			}
		},
		{
			gameMethod: '特码-特码B', methodId: 'SB',
			gameRules: {
				sections: type.PICK_NUM, set: [type.LEADNUM_1_49],
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-49']
			}
		},
		{
			gameMethod: '特码-特码种类', methodId: 'BS',
			gameRules: {
				sections: type.CATEGORY, set: [type.SPECIAL_SYMBOLICS],
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-24']
			}
		},
		{
			gameMethod: '特码-特码色波', methodId: 'C',
			gameRules: {
				sections: type.CATEGORY, set: [type.COLOR_NUM], isGroupBtn: true,
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-3']
			}
		},
		{
			gameMethod: '色波-色波半波', methodId: 'C',
			gameRules: {
				sections: type.CATEGORY, set: [type.MIX_TWO],
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-12']
			}
		},
		{
			gameMethod: '色波-色波半半波', methodId: 'C',
			gameRules: {
				sections: type.CATEGORY, set: [type.MIX_THREE],
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-12']
			}
		},
		{
			gameMethod: '正码-正码选号', methodId: 'NG',
			gameRules: {
				sections: type.PICK_NUM, set: [type.LEADNUM_1_49],
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-49']
			}
		},
		{
			gameMethod: '平特-平特一肖', methodId: 'GSX',
			gameRules: {
				sections: type.CATEGORY, set: [type.SYMBOLICS],
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-12']
			}
		},
		{
			gameMethod: '平特-平特尾数', methodId: 'GST',
			gameRules: {
				sections: type.CATEGORY, set: [type.TAIL_NUM],
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-10']
			}
		},
		{
			gameMethod: '特肖生肖', methodId: 'SX',
			gameRules: {
				sections: type.CATEGORY, set: [type.SYMBOLICS],
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-12']
			}
		},
		{
			gameMethod: '头尾数', methodId: 'SHT',
			gameRules: {
				sections: type.CATEGORY, set: [type.HEAD_TAIL_NUM],
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-15']
			}
		},
		{
			gameMethod: '五行', methodId: 'FX',
			gameRules: {
				sections: type.CATEGORY, set: [type.FIVE_ELEMENTS],
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-5']
			}
		},
		{
			gameMethod: '正肖生肖', methodId: 'GX',
			gameRules: {
				sections: type.CATEGORY, set: [type.SYMBOLICS],
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-12']
			}
		},
		{
			gameMethod: '种类-7色波种类', methodId: 'SC',
			gameRules: {
				sections: type.CATEGORY, set: [type.COLOR_THREE],
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-3']
			}
		},
		{
			gameMethod: '种类-总肖种类', methodId: 'XC',
			gameRules: {
				sections: type.CATEGORY, set: [type.TOTAL_SYMBOLICS],
				formula: type.DUPLEX, minimumRowPick: 1, pickRange: ['1-8']
			}
		},
	],
	PL: [
		{
			gameMethod: '三星-三星组三', methodId: 'GRP3',
			gameRules: {
				sections: type.PICK_NUM, set: [type.NUM_0_9],
				formula: type.GROUP_3, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		{
			gameMethod: '三星-三星组三和值', methodId: 'G3S',
			gameRules: {
				sections: type.SUM_VALUES, set: [type.NUM_1_26],
				formula: type.SUM, minimumRowPick: 1, pickRange: ['1-26'],
			}
		},
		{
			gameMethod: '三星-三星组六', methodId: 'GRP6',
			gameRules: {
				sections: type.PICK_NUM, set: [type.NUM_0_9],
				formula: type.GROUP_6, minimumRowPick: 1, pickRange: ['3-10']
			}
		},
		{
			gameMethod: '三星-三星组六和值', methodId: 'G6S',
			gameRules: {
				sections: type.SUM_VALUES, set: [type.NUM_3_24],
				formula: type.SUM, minimumRowPick: 1, pickRange: ['1-22'],
			}
		},
		{
			gameMethod: '三星-三星直选', methodId: 'NIO3',
			gameRules: {
				sections: type.UNITS_B_S_G, set: [type.NUM_0_9],
				formula: type.DUPLEX, minimumRowPick: 3, pickRange: ['1-10', '1-10', '1-10']
			}
		},
		{
			gameMethod: '三星-三星直选和值', methodId: 'NS3',
			gameRules: {
				sections: type.SUM_VALUES, set: [type.NUM_0_27],
				formula: type.SUM, minimumRowPick: 1, pickRange: ['1-28'],
			}
		},
		{
			gameMethod: '二星-前二组选', methodId: 'F2',
			gameRules: {
				sections: type.PICK_NUM, set: [type.NUM_0_9], uniqueInt: 2,
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		{
			gameMethod: '二星-前二直选', methodId: 'F2IO',
			gameRules: {
				sections: type.UNITS_S_G, set: [type.NUM_0_9],
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-10', '1-10']
			}
		},
		{
			gameMethod: '二星-后二组选', methodId: 'L2',
			gameRules: {
				sections: type.PICK_NUM, set: [type.NUM_0_9], uniqueInt: 2,
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		{
			gameMethod: '二星-后二直选', methodId: 'L2IO',
			gameRules: {
				sections: type.UNITS_S_G, set: [type.NUM_0_9],
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-10', '1-10']
			}
		},
		{
			gameMethod: '大小单双-前二大小单双', methodId: 'F2BSOE',
			gameRules: {
				sections: type.UNITS_W_Q, set: [type.BSOE],
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-4', '1-4']
			}
		},
		{
			gameMethod: '大小单双-后二大小单双', methodId: 'L2BSOE',
			gameRules: {
				sections: type.UNITS_S_G, set: [type.BSOE],
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-4', '1-4']
			}
		},
		{
			gameMethod: '不定位-一码不定位', methodId: 'NS1P',
			gameRules: {
				sections: type.UNFIX, set: [type.NUM_0_9],
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10']
			}
		},
		{
			gameMethod: '不定位-二码不定位', methodId: 'NS2P',
			gameRules: {
				sections: type.UNFIX, set: [type.NUM_0_9], uniqueInt: 2, 
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		{
			gameMethod: '定位胆', methodId: 'SP',
			gameRules: {
				sections: type.UNITS_B_S_G, set: [type.NUM_0_9],
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10', '1-10', '1-10']
			}
		},
	],
	PK: [
		{
			gameMethod: '任选一', methodId: 'R1',
			gameRules: {
				sections: type.PICK_NUM, set: [type.NUM_0_9], isPoker: true,
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-13']
			}
		},
	],
	SSC: [
		{
			gameMethod: '定位胆', methodId: 'DN',
			gameRules: {
				sections: type.UNITS_W_Q_B_S_G, set: [type.NUM_0_9],
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10', '1-10', '1-10', '1-10', '1-10']
			}
		},
		{
			gameMethod: '五星-五星直选', methodId: 'D5',
			gameRules: {
				sections: type.UNITS_W_Q_B_S_G, set: [type.NUM_0_9],
				formula: type.DUPLEX, minimumRowPick: 5, pickRange: ['1-10', '1-10', '1-10', '1-10', '1-10']
			}
		},
		{
			gameMethod: '五星-五星通选', methodId: 'C5',
			gameRules: {
				sections: type.UNITS_W_Q_B_S_G, set: [type.NUM_0_9],
				formula: type.DUPLEX, minimumRowPick: 5, pickRange: ['1-10', '1-10', '1-10', '1-10', '1-10']
			}
		},
		{
			gameMethod: '三星-三星直选', methodId: 'D3',
			gameRules: {
				sections: type.UNITS_B_S_G, set: [type.NUM_0_9],
				formula: type.DUPLEX, minimumRowPick: 3, pickRange: ['1-10', '1-10', '1-10']
			}
		},
		{
			gameMethod: '三星-三星组三', methodId: 'C33',
			gameRules: {
				sections: type.PICK_NUM, set: [type.NUM_0_9],
				formula: type.GROUP_3, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		{
			gameMethod: '三星-三星组六', methodId: 'C36',
			gameRules: {
				sections: type.PICK_NUM, set: [type.NUM_0_9],
				formula: type.GROUP_6, minimumRowPick: 1, pickRange: ['3-10']
			}
		},
		{
			gameMethod: '二星-二星直选', methodId: 'D2',
			gameRules: {
				sections: type.UNITS_S_G, set: [type.NUM_0_9],
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-10', '1-10']
			}
		},
		{
			gameMethod: '二星-二星组选', methodId: 'C2',
			gameRules: {
				sections: type.PICK_NUM, set: [type.NUM_0_9], uniqueInt: 2,
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		{
			gameMethod: '大小单双-后二大小单双', methodId: 'DXDS',
			gameRules: {
				sections: type.UNITS_S_G, set: [type.BSOE],
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-4', '1-4']
			}
		},
		{
			gameMethod: '大小单双-后三大小单双', methodId: 'DXDS_H3',
			gameRules: {
				sections: type.UNITS_B_S_G, set: [type.BSOE],
				formula: type.DUPLEX, minimumRowPick: 3, pickRange: ['1-4', '1-4', '1-4']
			}
		},
		{
			gameMethod: '大小单双-前二大小单双', methodId: 'DXDS_Q2',
			gameRules: {
				sections: type.UNITS_W_Q, set: [type.BSOE],
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-4', '1-4']
			}
		},
		{
			gameMethod: '大小单双-前三大小单双', methodId: 'DXDS_Q3',
			gameRules: {
				sections: type.UNITS_W_Q_B, set: [type.BSOE],
				formula: type.DUPLEX, minimumRowPick: 3, pickRange: ['1-4', '1-4', '1-4']
			}
		},
		{
			gameMethod: '不定位-前三一码', methodId: 'BDW_Q31',
			gameRules: {
				sections: type.UNFIX, set: [type.NUM_0_9],
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10']
			}
		},
		{
			gameMethod: '不定位-前三二码', methodId: 'BDW_Q32',
			gameRules: {
				sections: type.UNFIX, set: [type.NUM_0_9], uniqueInt: 2,
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		{
			gameMethod: '不定位-后三一码', methodId: 'BDW_H31',
			gameRules: {
				sections: type.UNFIX, set: [type.NUM_0_9],
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10']
			}
		},
		{
			gameMethod: '不定位-后三二码', methodId: 'BDW_H32',
			gameRules: {
				sections: type.UNFIX, set: [type.NUM_0_9], uniqueInt: 2, 
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		{
			gameMethod: '不定位-前四一码', methodId: 'BDW_Q41',
			gameRules: {
				sections: type.UNFIX, set: [type.NUM_0_9],
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10']
			}
		},
		{
			gameMethod: '不定位-前四二码', methodId: 'BDW_Q42',
			gameRules: {
				sections: type.UNFIX, set: [type.NUM_0_9], uniqueInt: 2,
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		{
			gameMethod: '不定位-后四一码', methodId: 'BDW_H41',
			gameRules: {
				sections: type.UNFIX, set: [type.NUM_0_9],
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10']
			}
		},
		{
			gameMethod: '不定位-后四二码', methodId: 'BDW_H42',
			gameRules: {
				sections: type.UNFIX, set: [type.NUM_0_9], uniqueInt: 2,
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		{
			gameMethod: '不定位-五星一码', methodId: 'BDW_Q51',
			gameRules: {
				sections: type.UNFIX, set: [type.NUM_0_9],
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10']
			}
		},
		{
			gameMethod: '不定位-五星二码', methodId: 'BDW_Q52',
			gameRules: {
				sections: type.UNFIX, set: [type.NUM_0_9], uniqueInt: 2,
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		{
			gameMethod: '不定位-五星三码', methodId: 'BDW_Q53',
			gameRules: {
				sections: type.UNFIX, set: [type.NUM_0_9],
				formula: type.DIRECT_COMBINE, minimumRowPick: 1, pickRange: ['3-10']
			}
		},
		{
			gameMethod: '任选二-直选复式', methodId: 'R2Z',
			gameRules: {
				sections: type.UNITS_W_Q_B_S_G, set: [type.NUM_0_9],
				formula: type.COMBO_DUPLEX, minimumRowPick: 2, pickRange: ['1-10', '1-10', '1-10', '1-10', '1-10']
			}
		},
		{
			gameMethod: '任选二-直选和值', methodId: 'R2Z_HZ',
			gameRules: {
				sections: type.SUM_VALUES, set: [type.NUM_0_18], openOptions: type.UNITS_W_Q_B_S_G,
				formula: type.SUM__OPEN, minimumRowPick: 1, pickRange: ['1-19'], uniqueInt: 2
			}
		},
		{
			gameMethod: '任选二-组选复式', methodId: 'R2C',
			gameRules: {
				sections: type.PICK_GROUP, set: [type.NUM_0_9], openOptions: type.UNITS_W_Q_B_S_G,
				formula: type.GROUP_2__OPEN, minimumRowPick: 1, pickRange: ['2-10'], uniqueInt: 2, 
			}
		},
		{
			gameMethod: '任选二-组选和值', methodId: 'R2C_HZ',
			gameRules: {
				sections: type.SUM_VALUES, set: [type.NUM_0_18], openOptions: type.UNITS_W_Q_B_S_G,
				formula: type.SUM__OPEN, minimumRowPick: 1, pickRange: ['1-19'], uniqueInt: 2
			}
		},
		{
			gameMethod: '任选三-直选复式', methodId: 'R3Z',
			gameRules: {
				sections: type.UNITS_W_Q_B_S_G, set: [type.NUM_0_9],
				formula: type.COMBO_DUPLEX, minimumRowPick: 3, pickRange: ['1-10', '1-10', '1-10', '1-10', '1-10']
			}
		},
		{
			gameMethod: '任选三-直选和值', methodId: 'R3Z_HZ',
			gameRules: {
				sections: type.SUM_VALUES, set: [type.NUM_0_27], openOptions: type.UNITS_W_Q_B_S_G,
				formula: type.SUM__OPEN, minimumRowPick: 1, pickRange: ['1-28'], uniqueInt: 3
			}
		},
		{
			gameMethod: '任选三-组三复式', methodId: 'R3C3',
			gameRules: {
				sections: type.PICK_NUM, set: [type.NUM_0_9], openOptions: type.UNITS_W_Q_B_S_G,
				formula: type.GROUP_3__OPEN, minimumRowPick: 1, pickRange: ['2-10'], uniqueInt: 3
			}
		},
		{
			gameMethod: '任选三-组六复式', methodId: 'R3C6',
			gameRules: {
				sections: type.PICK_NUM, set: [type.NUM_0_9], openOptions: type.UNITS_W_Q_B_S_G,
				formula: type.GROUP_6__OPEN, minimumRowPick: 1, pickRange: ['3-10'], uniqueInt: 3
			}
		},
		{
			gameMethod: '任选三-组选和值', methodId: 'R3C_HZ',
			gameRules: {
				sections: type.SUM_VALUES, set: [type.NUM_0_27], openOptions: type.UNITS_W_Q_B_S_G,
				formula: type.SUM__OPEN, minimumRowPick: 1, pickRange: ['1-28'], uniqueInt: 3
			}
		},
		{
			gameMethod: '任选四-直选复式', methodId: 'R4Z',
			gameRules: {
				sections: type.UNITS_W_Q_B_S_G, set: [type.NUM_0_9],
				formula: type.COMBO_DUPLEX, minimumRowPick: 4, pickRange: ['1-10', '1-10', '1-10', '1-10', '1-10']
			}
		},
		{
			gameMethod: '任选四-组选24', methodId: 'R4C24',
			gameRules: {
				sections: type.PICK_GROUP_24, set: [type.NUM_0_9], openOptions: type.UNITS_W_Q_B_S_G,
				formula: type.GROUP_PICK_24__OPEN, minimumRowPick: 1, pickRange: ['4-10'], uniqueInt: 4
			}
		},
		{
			gameMethod: '任选四-组选12', methodId: 'R4C12',
			gameRules: {
				sections: type.DOUBLE_SINGLE_NUM, set: [type.NUM_0_9], openOptions: type.UNITS_W_Q_B_S_G, isUnique: true,
				formula: type.GROUP_PICK_12__OPEN, minimumRowPick: 2, pickRange: ['1-10', '2-10'], uniqueInt: 4
			}
		},
		{
			gameMethod: '任选四-组选6', methodId: 'R4C6',
			gameRules: {
				sections: type.TRIPLE_SINGLE_NUM, set: [type.NUM_0_9], openOptions: type.UNITS_W_Q_B_S_G,
				formula: type.GROUP_PICK_6__OPEN, minimumRowPick: 1, pickRange: ['2-10'], uniqueInt: 4
			}
		},
		{
			gameMethod: '任选四-组选4', methodId: 'R4C4',
			gameRules: {
				sections: type.DOUBLE_NUM, set: [type.NUM_0_9], openOptions: type.UNITS_W_Q_B_S_G, isUnique: true,
				formula: type.GROUP_PICK_4__OPEN, minimumRowPick: 2, pickRange: ['1-10', '1-10'], uniqueInt: 4
			}
		},
	],
	SSL: [
		{
			gameMethod: '二星-前二直选', methodId: 'F2IO',
			gameRules: {
				sections: type.UNITS_B_S, set: [type.NUM_0_9],
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-10', '1-10'],
			}
		},
		{
			gameMethod: '二星-前二组选', methodId: 'F2',
			gameRules: {
				sections: type.PICK_NUM, set: [type.NUM_0_9], uniqueInt: 2,
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		{
			gameMethod: '二星-后二直选', methodId: 'L2IO',
			gameRules: {
				sections: type.UNITS_S_G, set: [type.NUM_0_9],
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-10', '1-10'],
			}
		},
		{
			gameMethod: '二星-后二组选', methodId: 'L2',
			gameRules: {
				sections: type.PICK_NUM, set: [type.NUM_0_9], uniqueInt: 2,
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		{
			gameMethod: '三星-直选复式', methodId: 'NIO3',
			gameRules: {
				sections: type.UNITS_B_S_G, set: [type.NUM_0_9],
				formula: type.COMBO_DUPLEX, minimumRowPick: 3, pickRange: ['1-10', '1-10', '1-10']
			}
		},
		{
			gameMethod: '三星-直选和值', methodId: 'NS3',
			gameRules: {
				sections: type.SUM_VALUES, set: [type.NUM_1_26],
				formula: type.SUM, minimumRowPick: 1, pickRange: ['1-26'],
			}
		},
		{
			gameMethod: '三星-组三复式', methodId: 'GRP3',
			gameRules: {
				sections: type.PICK_NUM, set: [type.NUM_0_9], uniqueInt: 3,
				formula: type.GROUP_3, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		{
			gameMethod: '三星-组三和值', methodId: 'G3S',
			gameRules: {
				sections: type.SUM_VALUES, set: [type.NUM_1_26],
				formula: type.SUM, minimumRowPick: 1, pickRange: ['1-26'],
			}
		},
		{
			gameMethod: '三星-组六复式', methodId: 'GRP6',
			gameRules: {
				sections: type.PICK_NUM, set: [type.NUM_0_9], uniqueInt: 3,
				formula: type.GROUP_6, minimumRowPick: 1, pickRange: ['3-10']
			}
		},
		{
			gameMethod: '三星-组六和值', methodId: 'G6S',
			gameRules: {
				sections: type.SUM_VALUES, set: [type.NUM_3_24],
				formula: type.SUM, minimumRowPick: 1, pickRange: ['1-22'],
			}
		},
		{
			gameMethod: '不定位-一码不定位', methodId: 'NS1P',
			gameRules: {
				sections: type.UNFIX, set: [type.NUM_0_9],
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10']
			}
		},
		{
			gameMethod: '不定位-二码不定位', methodId: 'NS2P',
			gameRules: {
				sections: type.UNFIX, set: [type.NUM_0_9], uniqueInt: 2, 
				formula: type.GROUP_2, minimumRowPick: 1, pickRange: ['2-10']
			}
		},
		{
			gameMethod: '大小单双-前二大小单双', methodId: 'F2BSOE',
			gameRules: {
				sections: type.UNITS_B_S, set: [type.BSOE],
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-4', '1-4']
			}
		},
		{
			gameMethod: '大小单双-后二大小单双', methodId: 'L2BSOE',
			gameRules: {
				sections: type.UNITS_S_G, set: [type.BSOE],
				formula: type.DUPLEX, minimumRowPick: 2, pickRange: ['1-4', '1-4']
			}
		},
		{
			gameMethod: '定位胆', methodId: 'SP',
			gameRules: {
				sections: type.UNITS_B_S_G, set: [type.NUM_0_9],
				formula: type.SINGLE, minimumRowPick: 1, pickRange: ['1-10', '1-10', '1-10']
			}
		}
	],
};
