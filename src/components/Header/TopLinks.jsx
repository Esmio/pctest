import React from 'react';
import { Row, Column, MDIcon } from '../General';
import css from '../../styles/header/header.less';

function TopLinks() {
	const headerLinks = [
		{
			placeholder: '帮助中心',
			permalink: 'http://www.baidu.com'
		}, {
			placeholder: '加入代理',
			permalink: 'http://www.baidu.com'
		}, {
			placeholder: '玩法',
			permalink: 'http://www.baidu.com'
		}, {
			placeholder: '注册',
			permalink: 'http://www.baidu.com'
		}, {
			placeholder: '手机站',
			permalink: 'http://www.baidu.com',
			icon: 'cellphone-iphone'
		}, {
			placeholder: '加入收藏',
			permalink: 'http://www.baidu.com',
			icon: 'star'
		}
	];
	function renderIcon(iconName) {
		if (iconName) {
			return (<MDIcon iconName={iconName} className={css.header_permalinkIcon} />);
		}
		return null;
	}
	function renderScene(links) {
		return (
			<Row>
				{links.map((i, index) => {
					return (
						<a
							className={css.header_permalink}
							href={i.permalink}
							target="_blank"
							rel="noopener noreferrer"
							key={index}
						>
							{renderIcon(i.icon)}
							{i.placeholder}
						</a>
					);
				})
}
			</Row>
		);
	}
	if (headerLinks) {
		return (
			<Column float="right">
				{renderScene(headerLinks)}
			</Column>
		);
	}
	return null;
}

export default TopLinks;
