import React from 'react';
import { Carousel } from 'antd';
import { connect } from 'dva';
import css from '../../styles/homepage/carousel.less';

function CarouselBag({
	promotionBanners
}) {
	function renderScene() {
		if (promotionBanners) {
			return promotionBanners.map((banner, index) => {
				const { bannerImageUrl, userClickUrl } = banner;
				const carouselImgStyles = {
					backgroundImage: `url('${bannerImageUrl}')`
				};
				return (
					<a key={`${index}__${bannerImageUrl}`}>
						<div
							className={css.carousel_img}
							key={index} href={userClickUrl}
							target="_black"
							style={carouselImgStyles}
						/>
					</a>
				);
			});
		}
		return <div />;
	}
	return (
		<div className={css.container}>
			<div className={css.carousel}>
				<Carousel autoplay>
					{ renderScene() }
				</Carousel>
			</div>
		</div>
	);
}

const mapStatesToProps = ({ gameInfosModel }) => {
	const { promotionBanners } = gameInfosModel;
	return { promotionBanners };
};

export default connect(mapStatesToProps)(CarouselBag);
