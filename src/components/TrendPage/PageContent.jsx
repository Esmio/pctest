import React from 'react';
import { Link, routerRedux } from 'dva/router';
import styles from './PageContent.less';
import { hasTrendChart } from '../../utils';

class PageContent extends React.Component {
	static defaultProps = {
		buttons: ['全部彩种', '时时彩', '快三', '十一选5', '低频'],
		buttonsItems: { 
			HF_AHD11: '安徽11选5',
			HF_AHK3: '安徽快3',
			HF_BJPK10: '北京PK10',
			HF_CQKL10F: '重庆快乐10分',
			HF_CQSSC: '重庆时时彩',
			HF_GDD11: '广东11选5',
			HF_GDKL10F: '广东快乐10分',
			HF_GXK3: '广西快3',
			HF_JSK3: '江苏快3',
			HF_JXD11: '江西11选5',
			HF_LF28: '幸运28',
			HF_LFKLPK: '幸运扑克',
			HF_LFPK10: '二分PK10',
			HF_LFSSC: '二分时时彩',
			HF_SDD11: '山东11选5',
			HF_SG28: '新加坡28',
			HF_SHD11: '上海11选5',
			HF_SHSSL: '上海时时乐',
			HF_TJKL10F: '天津快乐10分',
			HF_TJSSC: '天津时时彩',
			HF_XJSSC: '新疆时时彩',
			MARK_SIX: '香港6合彩',
			PL3: '排列3',
			PL5: '排列5',
			UNRECOGNIZED: 'PC蛋蛋',
			X3D: '福彩3D'
		},
		buttonsClasses: [
			['HF_CQSSC', 'HF_LFPK10', 'HF_LFSSC', 'HF_SHSSL', 'HF_TJSSC', 'HF_XJSSC'],
			['HF_AHK3', 'HF_GXK3', 'HF_JSK3'],
			['HF_AHD11', 'HF_GDD11', 'HF_JXD11', 'HF_SDD11'],
			['MARK_SIX', 'X3D', 'PL3'],
			['HF_LF28', 'HF_SG28', 'UNRECOGNIZED'],
			['HF_CQKL10F', 'HF_GDKL10F', 'HF_TJKL10F']
		]
	}
	constructor(props) {
		super(props);
		this.state = {
			buttonIndex: '-1'
		};
		this.handleButtonClick = this.handleButtonClick.bind(this);
		this.handleLottoClick = this.handleLottoClick.bind(this);
	}
	handleButtonClick(e) {
		const { index } = e.target.dataset;
		this.setState({ buttonIndex: index });
	}
	handleLottoClick(e) {
		const { dispatch } = this.props;
		while (!e.target.dataset.id) {
			e.target = e.target.parentNode;
		}
		const { id } = e.target.dataset;
		if (!hasTrendChart(id)) return false;
		dispatch(routerRedux.push({
			pathname: 'trend',
			query: {
				gameUniqueId: id
			}
		}));
	}
	LotteryDict() {
		const lotteryIconStr = localStorage.getItem('lotteryIconStr');
		const lotteryIcon = JSON.parse(lotteryIconStr);
		const lotteryNameStr = localStorage.getItem('lotteryNameStr');
		const lotteryName = JSON.parse(lotteryNameStr);
		const lotteryIconGrayStr = localStorage.getItem('lotteryIconGrayStr');
		const lotteryIconGray = JSON.parse(lotteryIconGrayStr);
		
		return { lotteryIcon, lotteryName, lotteryIconGray };
	}
	renderButtons() {
		const { buttons } = this.props;
		const { buttonIndex } = this.state;
		const buttonStyle = { borderBottom: '2px solid red', color: 'red' };
		const nodes = buttons.map((btn, index) => {
			const style = buttonIndex === index - 1 ? buttonStyle : null;
			return (
				<div
					className={styles.button}
					data-index={index - 1} key={index}
					style={style} onClick={this.handleButtonClick}
				>
					{btn}
				</div>
			);
		});
		return nodes;
	}
	//  render buttons
	renderCategoryClasses() {
		const { buttonsClasses } = this.props;
		const { buttonIndex } = this.state;
		let curButtons = buttonsClasses[buttonIndex];
		const { lotteryName } = this.LotteryDict();
		if (buttonIndex === '-1') {
			curButtons = [];
			buttonsClasses.map((arr) => {
				curButtons = curButtons.concat(arr);
			});
		}
		const nodes = curButtons.map((id) => {
			if (hasTrendChart(id)) {
				const backgroundColor = hasTrendChart(id) ? '' : '#ccc';
				const linkProps = {
					'data-id': id,
					className: styles.lotto,
					key: id,
					style: { backgroundColor },
					target: 'trendPage',
					to: `/trend?gameUniqueId=${id}`,
				};
				return (
					<Link {...linkProps}>
						{lotteryName[id]}
					</Link>
				);
			}
		});
		return nodes;
	}
	renderSelectNav() {
		return (<div className={styles.headerSelect}>
			<div className={styles.nav}>{this.renderButtons()}</div>
			<div className={styles.content}>{this.renderCategoryClasses()}</div>
		</div>);
	}
	// 有icon区块
	renderIconButtons(i) {
		const { buttonsClasses } = this.props;
		const { lotteryName, lotteryIcon, lotteryIconGray } = this.LotteryDict();
		const curLotto = buttonsClasses[i];
		const nodes = curLotto.map((id) => {
			if (hasTrendChart(id)) {
				const icon = hasTrendChart(id) ? lotteryIcon[id] : lotteryIconGray[id];
				const linkProps = {
					'data-id': id,
					className: styles.iconItem,
					key: id,
					target: 'trendPage',
					to: `/trend?gameUniqueId=${id}`,
				};
				return (
					<Link {...linkProps}>
						<img className={styles.icon} src={icon} alt={lotteryName[id]} />
						<span className={styles.iconName}>{lotteryName[id]}</span>
					</Link>
				);
			}
			return null;
		});
		return nodes;
	}
	renderWithIconBox() {
		let { buttons } = this.props;
		buttons = buttons.slice(-(buttons.length - 1));
		const nodes = buttons.map((title, index) => {
			return (<div className={styles.box} key={index}>
				<div className={styles.title}>{title}</div>
				<div className={styles.iconContainer}>
					{this.renderIconButtons(index)}
				</div>
			</div>);
		});
		return nodes;		
	}
	render() {
		return (
			<div className={styles.normal}>
				{this.renderSelectNav()}
				{this.renderWithIconBox()}
			</div>
		);
	}
}

export default PageContent;
