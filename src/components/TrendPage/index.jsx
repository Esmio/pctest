import React from 'react';
import styles from './index.less';
import {connect} from 'dva';
import Header from '../Header/Header';
import Footer from '../Footer/FooterBar';
import PageContent from './PageContent';

function mapItems(option) {
	let {data, target, key, value} = option;
	if(!data) return false
	data.map((item, index)=> {
		let targetKey = item[key],
			targetValue = item[value];
		if(!target[targetKey]) {
			target[targetKey] = targetValue;
		}
	})
}

function TrendChartPage({dispatch, gameInfosHot, gameInfosRecommend}){
	let contentProps = {dispatch, gameInfosHot, gameInfosRecommend}
	if(!gameInfosHot || !gameInfosHot) return null
	let lotteryIcon = {}, lotteryName = {}, lotteryIconGray={};
	// 存Icon
	mapItems({data: gameInfosHot, target: lotteryIcon, key:'gameUniqueId', value:'gameIconUrl'})
	mapItems({data: gameInfosRecommend, target: lotteryIcon, key:'gameUniqueId', value:'gameIconUrl'})
	let lotteryIconStr = JSON.stringify(lotteryIcon)
	// 存名字
	mapItems({data: gameInfosHot, target: lotteryName, key:'gameUniqueId', value:'gameNameInChinese'})
	mapItems({data: gameInfosRecommend, target: lotteryName, key:'gameUniqueId', value:'gameNameInChinese'})
	let lotteryNameStr = JSON.stringify(lotteryName)
	// 存灰色icon   gameIconGrayUrl
	mapItems({data: gameInfosHot, target: lotteryIconGray, key:'gameUniqueId', value:'gameIconGrayUrl'})
	mapItems({data: gameInfosRecommend, target: lotteryIconGray, key:'gameUniqueId', value:'gameIconGrayUrl'})
	let lotteryIconGrayStr = JSON.stringify(lotteryIconGray)	
	
	localStorage.setItem('lotteryIconStr', lotteryIconStr)
	localStorage.setItem('lotteryNameStr', lotteryNameStr)
	localStorage.setItem('lotteryIconGrayStr', lotteryIconGrayStr)
	return (
	    <div className={styles.normal}>
	    	<Header/>
	      	<PageContent {...contentProps}/>
	      	<Footer/>
	    </div>
	);
}
function mapStateToProps(state){
	let {gameInfosHot, gameInfosRecommend} = state.gameInfosModel
	return {gameInfosHot, gameInfosRecommend}
}
export default connect(mapStateToProps)(TrendChartPage);
