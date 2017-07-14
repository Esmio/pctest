import React from 'react';
import styles from './HelpListContent.less';

class HelpListContent extends React.Component{
	constructor(props) {
		super(props);
	}
	handleLinkClick(id, content){
		const {dispatch} = this.props
		dispatch({type: 'homeInfoModel/updateState', payload:{id, content}})
	}
	_renderHelpLists(helpList){
		let links = helpList.map((item, index)=>{
			let {id, title, content} = item;
			let color = id === this.props.id ? '#108ee9' : '';
			return <span className={styles.links} key={id} style={{color}} onClick={this.handleLinkClick.bind(this, id, content)}>{title}</span>
		})
		return links
	}
	_renderNavItems(){
		const {helpListData} = this.props
		if(helpListData){
			let nodes = helpListData.map((item, index)=>{
				let {cateId, cateName, helpList} = item
				return <div className={styles.box} key={cateId}>
					<span className={styles.boxTitle}>{cateName}</span>
					<div className={styles.options}>
						{this._renderHelpLists(helpList)}
					</div>
				</div>
			})
			return nodes;
		}
	}
	render() {
		return <div className={styles.normal}>
			<div className={styles.nav}>
				<div className={styles.title}>帮助中心</div>
				<div className={styles.navContent}>
					{this._renderNavItems()}
				</div>
			</div>
			<div 
				className={styles.content}
				dangerouslySetInnerHTML=
    			{{__html: this.props.content}}
			>
			</div>
		</div>
	}
}

export default HelpListContent