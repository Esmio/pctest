import React, { Component } from 'react';
import { connect } from 'dva';
import css from '../../styles/homepage/winnerList.less';
import { isLastItem, addCommas } from '../../utils';

class WinnerList extends Component {
	truncate(username = '用户') {
		let name = username;
		if (username.length > 3) {
			name = `${username.substr(0, 3)}***`;
			return name;
		}
		return name;
	}
	renderBody(list) {
		return list.map((listItem, index) => {
			// console.debug(winner);
			const { username, winningAmount, gameNameInChinese } = listItem;
			return (
				<tr key={`${username}${index}`} >
					<td>{this.truncate(username)}</td>
					<td>
						{`${addCommas(winningAmount)}元`}
					</td>
					<td>{gameNameInChinese}</td>
				</tr>
			);
		});
	}
	render() {
		const { winnerList } = this.props;
		return (
			<div className={css.winnerList}>
				<h2 className={css.winnerList_header}>中奖排行榜</h2>
				<div className={css.winnderList_body}>
					<table>
						<thead>
							<tr>
								<td>用户名</td>
								<td>奖金</td>
								<td>彩种</td>
							</tr>
						</thead>
						<tbody>
							{ winnerList && this.renderBody(winnerList) }
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

const mapStatesToProps = ({ homeInfoModel, layoutModel }) => {
	const { centerPanelHeight, predictMapHeight, winnerListHeaderHeight } = layoutModel;
	const { winnerList } = homeInfoModel;

	return { winnerList, centerPanelHeight, predictMapHeight, winnerListHeaderHeight };
};

export default connect(mapStatesToProps)(WinnerList);
