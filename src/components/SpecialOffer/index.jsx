import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import Header from '../Header/Header';
import Footer from '../Footer/FooterBar';
import SpecialOfferContent from './SpecialOfferContent.jsx';

class SpecialOffer extends React.Component {
	render() {
		const { promotionList, pcPromotionTopImage, dispatch } = this.props;
		const contentProps = { promotionList, pcPromotionTopImage, dispatch };
		return (
			<div className={styles.normal}>
				<Header />
				<SpecialOfferContent {...contentProps} />
				<Footer />
			</div>
		);
	}
}
function mapStateToProps(state) {
	const { promotionList, pcPromotionTopImage } = state.specialoffer;
	return { promotionList, pcPromotionTopImage };
}

export default connect(mapStateToProps)(SpecialOffer);
