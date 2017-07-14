import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import { MDIcon } from '../General';
import css from '../../styles/footer/sitemap.less';
import logoC6 from '../../assets/image/logo2.png';

class Sitemap extends React.Component {
	static defaultProps = {
		dict: {
			账户安全: '\uE60A',
			购彩问题: '\uE608',
			充提问题: '\uE607',
			在线客服: '\uE609'
		},
		customerService: {
			cateName: '在线客服',
			helpList: [
				{
					title: 'QQ咨询：',
					cateId: {
							客服1: 'http://www.baidu.com',
							客服2: 'http://www.baidu.com',
							客服3: 'http://www.baidu.com'
					}
				},
				{
					title: '客服电话：400-636-0000',
					cateId: ''
				},
				{
					title: '在线咨询时间：周一~周日',
					cateId: ''
				},
				{
					title: '电话咨询时间：周一~周五',
					cateId: ''
				},
			]
		}
	}
	handleHelpListItemClick(id, content) {
		const { dispatch } = this.props;
		dispatch({ type: 'homeInfoModel/updateState', payload: { id, content } });
		dispatch(routerRedux.push({
			pathname: 'helplist'
		}));
	}
	renderIcon(hexcode) {
		return <span className={css.sitemap_labelIcon}>{hexcode}</span>;
	}

	renderList({ list, key }) {
		if (list) {
			return (
				<div key={key}>
					<h3 className={css.sitemap_label}>{ key }</h3>
					<ul className={css.sitemap_list}>
						{ 
							_.map(list, (item) => {
								const { id, title, content } = item;
								return (
									<li className={css.sitemap_listItem} key={id}>
										<a
											className={css.sitemap_permalink}
											onClick={this.handleHelpListItemClick.bind(this, id, content)}
										>
											{ title }
										</a>
									</li>
								);
							})
						}
					</ul>
				</div>
			);
		}

		return null;
	}

	renderSitemap() {
		const { helpListData } = this.props;
		const { dict } = this.props;
		if (helpListData) {
			const sitemaps = _.map(dict, (icon, key) => {
				let arrays = _.filter(helpListData, ['cateName', key]);
				arrays = _.map(arrays, (item) => {
					return item.helpList;
				});
				if (icon) {
					return (
						<div className={css.sitemap_column} key={key} >
							<div className={css.sitemap_columnBody}>
								<div className={css.siteMap_columnIcon}>
									{ this.renderIcon(icon) }
								</div>
								{ this.renderList({ list: arrays, key }) }
							</div>
						</div>
					);
				}
			});
			return (
				<div className={css.sitemap_row}>
					{ sitemaps }
				</div>
			);
		}

		return null;
	}

	render() {
		return (
			<div className={css.sitemap}>
				<div className={css.sitemap_body}>
					<div className={css.sitemap_leftColumn}>
						<div className={css.sitemap_logo}>
							<img src={logoC6} alt="c6 彩票" />
						</div>
						<div className={css.sitemap_benefits}>
							<p className={css.sitemap_benefit}>
								<MDIcon iconName="checkbox-marked" className={css.sitemap_checkbox} />
								账户安全
							</p>
							<p className={css.sitemap_benefit}>
								<MDIcon iconName="checkbox-marked" className={css.sitemap_checkbox} />
								购彩便捷
							</p>
							<p className={css.sitemap_benefit}>
								<MDIcon iconName="checkbox-marked" className={css.sitemap_checkbox} />
								兑奖简单
							</p>
							<p className={css.sitemap_benefit}>
								<MDIcon iconName="checkbox-marked" className={css.sitemap_checkbox} />
								提款快速
							</p>
						</div>
					</div>
					<div className={css.sitemap_rightColumn}>
						{/*{ this.renderSitemap() }*/}
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps({ homeInfoModel }) {
	const { helpListData } = homeInfoModel;
	return { helpListData };
}


export default connect(mapStateToProps)(Sitemap);
