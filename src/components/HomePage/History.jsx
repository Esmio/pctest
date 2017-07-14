import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import moment from 'moment';
import { EllipsisLoader, PokerCard, Dice, LotteryBalls } from '../General';
import css from '../../styles/homepage/history.less';
import { hasTrendChart, getDXDS, getMarkSixColor } from '../../utils';

class History extends Component {
	constructor(props) {
		super(props);
		this.state = {
			histories: [],
			maxHeight: null
		};
		this.dispatch = this.props.dispatch.bind(this);
		this.onTrendPageClick = this.onTrendPageClick.bind(this);
		this.onShowMoreClick = this.onShowMoreClick.bind(this);
	}
	componentWillMount() {
		if (this.props.allHistory) {
			// console.debug('componentWillMount', this.props.allHistory);
			this.setState({
				histories: this.storeAnnoucement(this.props)
			});
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.allHistory && nextProps.allHistory !== this.props.allHistory) {
			this.setState({
				histories: this.storeAnnoucement(nextProps)
			});
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
	onShowMoreClick() {
		this.dispatch(routerRedux.push({ pathname: '/history' }));
	}
	storeAnnoucement({ allHistory }) {
		const newHistories = [];
		allHistory.forEach((history) => {
			const {
				gameNameInChinese,
				openTime,
				gameUniqueId,
				openCode,
				uniqueIssueNumber
			} = history;
			const isPK = gameUniqueId === 'HF_KLPK' || gameUniqueId === 'HF_LFKLPK';
			newHistories.push(
				<li
					key={gameNameInChinese + uniqueIssueNumber}
					className={css.history_listItem}
				>
					<div>
						<div className={css.history_itemHeaders}>
							<p className={css.history_lotName}>{gameNameInChinese}</p>		
							<p className={css.history_lotPhase}>第{uniqueIssueNumber}期</p>
						</div>
						<p className={css.history_lotDate}>
							{moment(openTime).format('YYYY-MM-DD HH:mm:ss')}
						</p>
					</div>
					{ 
						openCode ?
						this.renderLotBalls(history) : 
						<p className={css.history_awaitMsg}>正在开奖 <EllipsisLoader duration={5000} /></p>
					}
					<p className={css.history_permalinks}>
						{
							hasTrendChart(gameUniqueId) ?
							<a
								onClick={this.onTrendPageClick.bind(this, gameUniqueId)}
								className={css.history_permalink}
							>走势
							</a> : null
						}
						<a
							disabled={isPK}
							onClick={this.onBetCenterClick.bind(this, gameUniqueId)}
							className={css.history_permalink}
						>
							{ isPK ? '尚未开放' : '投注' }
						</a>
						<Link
							target="_blank"
							to={`/history?gameUniqueId=${gameUniqueId}`}
							className={css.history_permalink}
						>
							历史开奖
						</Link>
					</p>
				</li>
			);
		}, this);
		return newHistories;
	}
	renderLotBalls({ gameUniqueId, openCode }) {
		const lotteryBallsProps = {
			diceSize: '1.5rem',
			gameId: gameUniqueId,
			numsClassName: css.history_number,
			numsContainerClassName: css.history_numbers,
			numsDividerClassName: css.history_numberDivider,
			openCode,
			pokerSize: 0.75
		};
		return <LotteryBalls {...lotteryBallsProps} />;
	}
	render() {
		const { histories } = this.state;
		return (
			<div className={css.history_panel}>
				<div className={css.history_headers}>
					<h4 className={css.history_header}>开奖公告</h4>
					<h3 className={css.history_btn__loadMore}>
						<a onClick={this.onShowMoreClick}>更多</a>
					</h3>
				</div>
				<div className={css.history_list}>
					{ histories }
				</div>
			</div>
		);
	}
}

const mapStatesToProps = ({ layoutModel, gameInfosModel }) => {
	const {
		centerPanelHeight,
		QRPanelHeight,
		tutorialListHeight,
		lotteryNoticeHeaderHeight
	} = layoutModel;
	const {
		allHistory
	} = gameInfosModel;
	return {
		allHistory,
		centerPanelHeight,
		QRPanelHeight,
		tutorialListHeight,
		lotteryNoticeHeaderHeight
	};
};

export default connect(mapStatesToProps)(History);
