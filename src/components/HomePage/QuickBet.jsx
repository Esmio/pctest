import React, { Component } from 'react';
import { Link, routerRedux } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';
import { MDIcon, LoadingBar, OrangeButton, EllipsisLoader, LotteryBalls } from '../General';
import { type as TYPE, hasTrendChart } from '../../utils';
import { betService } from '../../services';
import css from '../../styles/homepage/quickBet.less';

const { getRandomPicks, getBetString } = betService;

const gameSettings = {
	HF_CQSSC: {
		gameMethod: '五星-五星直选',
		methodId: 'D5',
		gameRules: {
			sections: TYPE.UNITS_W_Q_B_S_G,
			set: [TYPE.NUM_0_9],
			formula: TYPE.DUPLEX,
			minimumRowPick: 5,
			pickRange: ['1-10', '1-10', '1-10', '1-10', '1-10']
		}
	},
	HF_BJPK10: {
		gameMethod: '前三',
		methodId: 'GT3',
		gameRules: {
			sections: TYPE.TOP_THREE_RANK,
			set: [TYPE.LEADNUM_1_10],
			isUnique: true,
			formula: TYPE.TOP_THREE_BET,
			minimumRowPick: 3,
			pickRange: ['1-10', '1-10', '1-10']
		}
	},
	HF_SHD11: {
		gameMethod: '直选-前三直选',
		methodId: 'Q3Z',
		gameRules: {
			sections: TYPE.UNITS_W_Q_B,
			set: [TYPE.LEADNUM_1_11],
			isUnique: true,
			formula: TYPE.TOP_THREE_BET,
			minimumRowPick: 3,
			pickRange: ['1-11', '1-11', '1-11']
		}
	},
	MARK_SIX: {
		gameMethod: '特码-特码A',
		methodId: 'SA',
		gameRules: {
			sections: TYPE.PICK_NUM,
			set: [TYPE.LEADNUM_1_49],
			formula: TYPE.DUPLEX,
			minimumRowPick: 1,
			pickRange: ['1-49']
		}
	},
	X3D: {
		gameMethod: '三星-直选复式',
		methodId: 'NIO3',
		gameRules: {
			sections: TYPE.UNITS_B_S_G,
			set: [TYPE.NUM_0_9],
			formula: TYPE.DUPLEX,
			minimumRowPick: 3,
			pickRange: ['1-10', '1-10', '1-10']
		}
	},
};
const INITIAL_STATE = {
	currentFreq: '',
	highFreqAmount: 2,
	highFreqAmountUnit: 1,
	highFreqBetObj: '',
	highFreqBetStrArry: [],
	highFreqBetString: '',
	highFreqLotId: ['HF_CQSSC', 'HF_BJPK10', 'HF_SHD11'],
	highFreqLotIsPristine: true,
	highFreqMultiply: 1,
	highFreqResponseColor: '',
	highFreqResponseMsg: '',
	highFreqSelectedId: 'HF_CQSSC',
	lowFreqAmount: 2,
	lowFreqAmountUnit: 1,
	lowFreqBetObj: '',
	lowFreqBetStrArry: [],
	lowFreqBetString: '',
	lowFreqLotId: ['MARK_SIX', 'X3D'],
	lowFreqLotIsPristine: true,
	lowFreqMultiply: 1,
	lowFreqResponseColor: '',
	lowFreqResponseMsg: '',
	lowFreqSelectedId: 'MARK_SIX',
};
class CenterPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
		this.dispatch = this.props.dispatch.bind(this);
		this.onMultipleChange = this.onMultipleChange.bind(this);
		this.onConfirmClick = this.onConfirmClick.bind(this);
		this.onUnitToggle = this.onUnitToggle.bind(this);
		this.setAmount = this.setAmount.bind(this);
		this.setGameInfos = this.setGameInfos.bind(this);
		this.setOpenCode = this.setOpenCode.bind(this);
		this.onBetCenterClick = this.onBetCenterClick.bind(this);
		this.onTrendPageClick = this.onTrendPageClick.bind(this);
  }
	componentWillMount() {
		this.dispatch({ type: 'gameInfosModel/getHomepageInfo' });
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.allHistory !== nextProps.allHistory) {
			this.setGameInfos({ freq: 'high', id: this.state.highFreqSelectedId });
			this.setGameInfos({ freq: 'low', id: this.state.lowFreqSelectedId });
		}
		if (this.props.responseMessage !== nextProps.responseMessage) {
			const { currentFreq } = this.state;
			this.setState({
				[`${currentFreq}FreqResponseMsg`]: nextProps.responseMessage,
				[`${currentFreq}FreqResponseColor`]: nextProps.responseColor,				
			});
		}
	}
	componentDidUpdate(prevProps, prevState) {
		if (
			prevState.lowFreqAmountUnit !== this.state.lowFreqAmountUnit ||
			prevState.lowFreqMultiply !== this.state.lowFreqMultiply
		) {
			this.setAmount('low');
		}
		if (
			prevState.highFreqAmountUnit !== this.state.highFreqAmountUnit ||
			prevState.highFreqMultiply !== this.state.highFreqMultiply
		) {
			this.setAmount('high');
		}
	}
	onBetCenterClick(thisGameId) {
		this.dispatch({ type: 'betCenter/updateState', payload: { thisGameId } });
		this.dispatch(routerRedux.push({ pathname: '/betcenter' }));
	}
	onTrendPageClick(thisGameId) {
		this.dispatch(routerRedux.push({
			pathname: '/trend', query: { gameUniqueId: thisGameId }
		}));
	}
	onRandomNumClick(freq) {
		const thisGameId = this.state[`${freq}FreqSelectedId`];
		const gameRules = gameSettings[thisGameId].gameRules;
		const methodId = gameSettings[thisGameId].methodId;
    const thisBetObj = getRandomPicks(gameRules);
		const betString = getBetString({ thisBetObj }, gameRules);
		const ballArrays = _.split(betString, '|');
		
		this.dispatch({
			type: 'betCenter/updateState', payload: { thisGameId: this.state[`${freq}FreqSelectedId`] }
		});
		this.dispatch({
			type: 'betCenter/initializeState', payload: ['responseMessage', 'responseColor']
		});
		const newState = {
			[`${freq}FreqBetStrArry`]: ballArrays,
			[`${freq}FreqBetObj`]: thisBetObj,
			[`${freq}FreqBetString`]: betString,
			[`${freq}FreqLotIsPristine`]: false,
			[`${freq}FreqMethodId`]: methodId,
			currentFreq: freq,
		};
		this.setState(newState);
	}
	onConfirmClick(freq) {
		const thisGameId = this.state[`${freq}FreqSelectedId`];
		const betString = this.state[`${freq}FreqBetString`];
		const thisBetObj = this.state[`${freq}FreqBetObj`];
		const gameplayMethod = gameSettings[thisGameId].methodId;
		const gameMethod = gameSettings[thisGameId].gameMethod;
		const methodGroup = _.split(gameMethod, '-')[0];
		const amount = this.state[`${freq}FreqAmount`];
		const amountUnit = this.state[`${freq}FreqAmountUnit`];
		const multiply = this.state[`${freq}FreqMultiply`];
		const betEntry = {
			amount,
			amountUnit,
			betString,
			thisBetObj,
			gameMethod,
			gameplayMethod,
			id: `${gameplayMethod}__${gameMethod}__${betString}`,
			methodGroup,
			multiply,
			numberOfUnits: 1,
			thisOpenOption: [],
			pricePerUnit: 2,
			returnMoneyRatio: '0.000',
		};
		this.dispatch({
			type: 'betCenter/updateState',
			payload: { betEntries: [betEntry] }
		});
		this.onBetCenterClick(thisGameId);
	}
	onMultipleChange({ freq, multiply }) {
    if (multiply > 0) {
      this.setState({ [`${freq}FreqMultiply`]: multiply });
    } else {
      this.setState({ [`${freq}FreqMultiply`]: 1 });
    }
  }
	onUnitToggle({ freq, unit }) {
    this.setState({ [`${freq}FreqAmountUnit`]: unit });
  }
	onSelectGame({ freq, id }) {
		this.setState({
			[`${freq}FreqSelectedId`]: id,
		});
		this.dispatch({ type: 'gameInfosModel/getAllHistory' });
		this.dispatch({
			type: 'betCenter/initializeState', payload: ['responseMessage', 'responseColor']
		});
		this.setGameInfos({ freq, id });
	}
	setGameInfos({ freq, id }) {
		const { allHistory } = this.props;
		const lotteryHistory = _.find(allHistory, ['gameUniqueId', id]);
		let betStrArry = [];
		let uniqueIssueNumber = '';
		if (lotteryHistory) {
			uniqueIssueNumber = lotteryHistory.uniqueIssueNumber;
			if (lotteryHistory.openStatus) {
				betStrArry = _.split(lotteryHistory.openCode, ',');
			}
		}
		this.setState({
			[`${freq}FreqBetStrArry`]: betStrArry,
			[`${freq}FreqBetString`]: '',
			[`${freq}FreqLotIsPristine`]: true,
			[`${freq}FreqUniqueIssueNumber`]: uniqueIssueNumber,
		});
	}
	setAmount(freq) {
		const amountUnit = this.state[`${freq}FreqAmountUnit`];
		const multiply = this.state[`${freq}FreqMultiply`];
		let amount = 2 * amountUnit * multiply;
		amount = amount.toFixed(2);
		amount = _.toNumber(amount);
		this.setState({
			[`${freq}FreqAmount`]: amount
		});
		this.dispatch({
			type: 'betCenter/initializeState', payload: ['responseMessage', 'responseColor']
		});
	}
	setOpenCode(freq, { allHistory }) {
		if (allHistory) {
			const id = this.state[`${freq}FreqLotId`][0];
			const lotteryHistory = _.find(allHistory, ['gameUniqueId', id]);
			if (lotteryHistory.openStatus) {
				const betStrArry = _.split(lotteryHistory.openCode, ',');
				this.setState({
					[`${freq}BetStrArry`]: betStrArry
				});
			}
		}
	}
	renderLotBalls(freq) {
		const gameId = this.state[`${freq}FreqSelectedId`];
		const betStrArry = this.state[`${freq}FreqBetStrArry`];
		const openCode = _.join(betStrArry, ',');
		const lotIsPristine = this.state[`${freq}FreqLotIsPristine`];
		const btnClass = lotIsPristine ? css.quickBet_refreshBtn__isPristine : css.quickBet_refreshBtn;
		if (!betStrArry.length) {
			return (
				<div className={css.quickBet_numberingRow}>
					<div className={css.quickBet_lotNumbers}>
						<p className={css.quickBet_awaitingMsg}>
							正等待开奖<EllipsisLoader duration={500} />
						</p>
					</div>
					<button
						onClick={this.onRandomNumClick.bind(this, freq)}
						className={btnClass}
					>
						<MDIcon iconName="autorenew" />
						换一注
					</button>
				</div>
			);
		} else if (lotIsPristine) {
			const lotteryBallsProps = {
        diceSize: '1rem',
        gameId,
        numsClassName: css.quickBet_contentsNumber__history,
        numsContainerClassName: css.quickBet_lotNumbers,
        numsDividerClassName: css.quickBet_lotNumbersDivider,
        openCode,
        pokerSize: 0.75
			};
			return (
				<div className={css.quickBet_numberingRow}>
					<div className={css.quickBet_lotNumbers}>
						<LotteryBalls {...lotteryBallsProps} />
					</div>
					<button
						onClick={this.onRandomNumClick.bind(this, freq)}
						className={btnClass}
					>
						<MDIcon iconName="autorenew" />
						换一注
					</button>
				</div>
			);
		}
    return (
			<div className={css.quickBet_numberingRow}>
				<div className={css.quickBet_lotNumbers}>
					{	
						betStrArry.map((number, index) => {
							return (
								<span
									className={css.quickBet_contentsNumber} key={`${number}${index}`}
								>{ number }
								</span>
							);
						})
					}
				</div>
				<button
					onClick={this.onRandomNumClick.bind(this, freq)}
					className={btnClass}
				>
					<MDIcon iconName="autorenew" />
					换一注
				</button>
			</div>
    );
  }
  renderTabs(freq) {
		const lotIds = this.state[`${freq}FreqLotId`];
		const { gameInfos } = this.props;
    const list = _.map(lotIds, (gameId) => {
      return _.find(gameInfos, ['gameUniqueId', gameId]);
    });
    if (list.length) {
      return _.map(list, (listItem) => {
        const {
          gameUniqueId, gameNameInChinese
        } = listItem;
				const btnIsActive = gameUniqueId === this.state[`${freq}FreqSelectedId`];
        return (
          <button
						data-active={btnIsActive}
						disabled={btnIsActive}
						key={gameUniqueId}
						className={css.quickBet_tab}
						onClick={this.onSelectGame.bind(this, { freq, id: gameUniqueId })}
          >
						{ gameNameInChinese }
					</button>
        );
      });
    } return null;
  }
	renderCal(freq) {
		const multiply = this.state[`${freq}FreqMultiply`];
		const amount = this.state[`${freq}FreqAmount`];
		const amountUnit = this.state[`${freq}FreqAmountUnit`];
		const betString = this.state[`${freq}FreqBetString`];
		return (
			<div className={css.quickBet_calRow}>
				<div className={css.quickBet_calulator}>
					<div className={css.quickBet_unitBtns}>
						{
							_.map(TYPE.UNITS, (unit, unitName) => {
								const buttonProps = {
									key: unitName,
									className: css.quickBet_unitBtn,
									'data-active': unit === amountUnit,
									onClick: this.onUnitToggle.bind(this, { freq, unit })
								};
								return (
									<button {...buttonProps}>
										{ unitName }
									</button>
								);
							})
						}
					</div>
					<div className={css.quickBet_multiplier}>
						<button
							className={css.quickBet_multiplyBtn}
							onClick={this.onMultipleChange.bind(this, { freq, multiply: multiply - 1 })}
						>
							<MDIcon iconName="minus-circle" />
						</button>
						<strong className={css.quickBet_multiplySpan}>{multiply} 倍</strong>
						<button
							className={css.quickBet_multiplyBtn}
							onClick={this.onMultipleChange.bind(this, { freq, multiply: multiply + 1 })}
						>
							<MDIcon iconName="plus-circle" />
						</button>
					</div>
					<span className={css.quickBet_amount}>{amount} 元</span>
				</div>
				<OrangeButton
					disabled={!betString}
					placeholder="下注"
					onClick={this.onConfirmClick.bind(this, freq)}
				/>
			</div>
		);
	}
	renderResponseMsg(freq) {
		const responseMsg = this.state[`${freq}FreqResponseMsg`];
		const responseColor = this.state[`${freq}FreqResponseColor`];
		if (responseMsg) {
			return (
				<p
					className={css.quickBet_responseMsg}
					style={{ backgroundColor: responseColor }}
				>
					{responseMsg}
				</p>
			);
		}
	}
	renderBody(freq) {
		const selectedGameId = this.state[`${freq}FreqSelectedId`];
		const lotIsPristine = this.state[`${freq}FreqLotIsPristine`];		
		const { gameInfos, allHistory } = this.props;
		const gameInfo = _.find(gameInfos, ['gameUniqueId', selectedGameId]);
		const gameHistory = _.find(allHistory, ['gameUniqueId', selectedGameId]);
		if (gameInfo) {
			const { gameDescription, gameIconUrl, gameNameInChinese } = gameInfo;
			const { uniqueIssueNumber } = gameHistory;
      return (
				<div className={css.quickBet_body}>
					<div className={css.quickBet_gameInfos}>
						<img src={gameIconUrl} alt={gameNameInChinese} className={css.quickBet_gameIcon} />
						<div className={css.quickBet_infoContent}>
							<p className={css.quickBet_gameIssueNo}>第{uniqueIssueNumber}期</p>
							<p className={css.quickBet_gameName}>{ gameNameInChinese }</p>
							<p className={css.quickBet_gameDescription} >{gameDescription}</p>
						</div>
						<div className={css.quickBet_actionBtns}>
							<button
								className={css.quickBet_actionBtn}
								onClick={this.onBetCenterClick.bind(this, selectedGameId)}
							>
								<MDIcon iconName="cursor-pointer" />
								<i>手动选号</i>
							</button>
							{
								hasTrendChart(selectedGameId) ?
								<Link
									to={`/trend?gameUniqueId=${selectedGameId}`}
									className={css.quickBet_actionBtn}
									target='trendPage'
								>
									<MDIcon iconName="table-large" />
									<i>走势图</i>
								</Link>
								: null
							}
						</div>
					</div>
					{ this.renderResponseMsg(freq) }
					<p
						className={css.quickBet_openCodeLabel}
					>
						{ lotIsPristine ? '上期开奖' : '投注'}号码
					</p>
					{ this.renderLotBalls(freq) }
					{ this.renderCal(freq) }
				</div>
      );
    } return null;
	}
  renderScene() {
		const { awaitingResponse } = this.props;
		return (
			<div>
				<div className={css.quickBet_section}>
					<div className={css.quickBet_tabs}>
						{ this.renderTabs('high') }
					</div>
					<LoadingBar style={{ margin: 0 }} isLoading={awaitingResponse} />
					{ this.renderBody('high') }
				</div>
				<div className={css.quickBet_section}>
					<div className={css.quickBet_tabs}>
						{ this.renderTabs('low') }
					</div>
					<LoadingBar style={{ margin: 0 }} isLoading={awaitingResponse} />		
					{ this.renderBody('low') }
				</div>
			</div>
		);
  }
  render() {
    const { gameInfos, allHistory } = this.props;
    if (gameInfos.length && allHistory.length) {
      return this.renderScene();
    } return null;
  }
}

const mapStatesToProps = ({ homeInfoModel, gameInfosModel, betCenter }) => {
  const {
    highFreqSelectedTab,
    lowFreqSelectedTab,
    highFreqSelectedContent,
    lowFreqSelectedContent,
  } = homeInfoModel;
  const { allHistory, gameInfosHot, gameInfosRecommend } = gameInfosModel;
  const gameInfos = [...gameInfosHot, ...gameInfosRecommend];
	const { responseMessage, responseColor } = betCenter;
	const awaitingResponse = betCenter.awaitingResponse || gameInfosModel.awaitingResponse;
  return {
		awaitingResponse,
    allHistory,
    gameInfos,
    highFreqSelectedTab,
    lowFreqSelectedTab,
    highFreqSelectedContent,
    lowFreqSelectedContent,
		responseMessage,
		responseColor
  };
};

export default connect(mapStatesToProps)(CenterPanel);
