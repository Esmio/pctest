import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styles from './SpecialOfferContent.less';

class SpecialOfferContent extends Component {
	static defaultProps = {
		buttons: ['全部活动', '存款优惠', '返利优惠', '其他优惠'],
		summaryDict: ['ALL', 'DEPOSIT', 'REFUND', 'OTHERS']
	}
	constructor(props) {
		super(props);
		this.state = {
			buttonIndex: '0',
			show: false,
			curBoxIndex: ''
		};
		this.handleButtonClick = this.handleButtonClick.bind(this);
		this.handleImgClick = this.handleImgClick.bind(this);
	}
	
	handleButtonClick(e) {
		while (!e.target.dataset.index) {
			e.target = e.target.parentNode;
		}
		const { index } = e.target.dataset;
		this.setState({ buttonIndex: index, curBoxIndex: '' });
	}
	handleImgClick(e) {
		const { curBoxIndex } = this.state;
		while (!e.target.dataset.index) {
			e.target = e.target.parentNode;
		}
		let { index } = e.target.dataset;
		if (index == curBoxIndex) index = '';
		this.setState({ curBoxIndex: index, show: !this.state.show });
	}
	renderLeftNav() {
		const { buttons } = this.props;
		const { buttonIndex } = this.state;
	const nodes = buttons.map((btn, index) => {
			let color = buttonIndex == index ? '#e4393c' : '',
				backgroundPositionY = buttonIndex == index ? '-71px' : '';
			return (<div className={styles.button} key={index} style={{color}} data-index={index} onClick={this.handleButtonClick}>
				<span className={styles.icon} style={{backgroundPositionY}}></span>
				<span className={styles.btnName}>{btn}</span>
				<span className={styles.iconRight}></span>
			</div>);
		});
		return (<div className={styles.nav}>
			{nodes}
		</div>);
	}
	componentDidUpdate(prevProps, prevState) {
		if (this.state.show && !prevState.show) {
			this.isAnimationTime = setTimeout(() => {
			}, 50);
		}
	}
	/*

	componentWillReceiveProps(nextProps) {//隐藏的时候执行动画
	    if (this.props.show === true && nextProps.show === false) {
		    this.setState({
		        inOutAnimation: true
		    });
		    ReactDOM.findDOMNode(this).getElementsByClassName("modal")[0].classList.remove("in");
		    this.outAnimationTime = setTimeout(()=> {
		        this.setState({
		        	inOutAnimation: false
		        });
		    }, 300);
	    }
	}
	*/

	renderSpecialOffers() {
		const { curBoxIndex, buttonIndex } = this.state;
		const { promotionList, dispatch, summaryDict } = this.props;
		if (!promotionList) return null;
		const { datas } = promotionList;
		const nodes = datas.map((item, index) => {
			const { content, createTime, title, photoMobile, summary } = item;
			const isShow = summary === summaryDict[buttonIndex] || summaryDict[buttonIndex] === 'ALL';
			return isShow ? <div className={styles.box} key={title + index}>
				<div className={styles.imgWrap} onClick={this.handleImgClick} data-index={index}>
				<img width="820px" height="215px" style={{ overflow: 'hidden' }} src={photoMobile} alt="" />
				</div>
				<div
					className={styles.specialOfferInfo}
					style={{ maxHeight: curBoxIndex === `${index}` ? '1200px' : '0px' }}
				>
					<div className={styles.infoTitle}>
						<span className={styles.activityTitle}>{title}</span>
						<span className={styles.date}>发布时间：{createTime}</span>
					</div>
					<div
className={styles.infoContent}
						dangerouslySetInnerHTML={{ __html: content }}
					/>
				</div>
			</div> : null;
		});
		return nodes;
	}
	render() {
		const { pcPromotionTopImage } = this.props;
		return (
			<div className={styles.normal}>
				<div className={styles.banner} style={{ backgroundImage: `url(${pcPromotionTopImage})` }} />
				<div className={styles.content}>
					<div>
						{this.renderLeftNav()}		    			
					</div>
				<div>
					{this.renderSpecialOffers()}
				</div>
			</div>
		</div>
		);
	}
}

export default SpecialOfferContent;
