import React from 'react';
import { connect } from 'dva';
import CarouselBag from './CarouselBag';
import QuickBet from './QuickBet';
import PredictMap from './PredictMap';
import WinnerList from './WinnerList';
import SideNav from './SideNav';
import QRPanel from './QRPanel';
import History from './History';
import TutorialList from './TutorialList';
import FooterContainer from '../Footer/FooterContainer';
import css from '../../styles/homepage/homepageBody.less';

function HomePageContent({ dispatch, helpListData }) {
	const TutorialListProps = { dispatch, helpListData };
	return (
		<div className={css.homePage_body}>
			<CarouselBag />
			<div className={css.homePage_bodyContent}>
				<div className={css.homePage_panel__side}>
					<div className={css.homePage_pabelBody}>
						<SideNav />
						<QRPanel />
						<WinnerList />
					</div>
				</div>
				<div className={css.homePage_panel__center}>
					<QuickBet />
					<TutorialList {...TutorialListProps} />
				</div>
				<div className={css.homePage_panel__side} style={{ right: 0 }}>
					<div className={css.homePage_pabelBody}>
						<PredictMap />
						<History />
					</div>
				</div>
			</div>
			<FooterContainer />
		</div>
	);
}

const mapStatesToProps = ({ homeInfoModel }) => {
	const {
		helpListData
	} = homeInfoModel;
	return {
		helpListData
	};
};

export default connect(mapStatesToProps)(HomePageContent);
