import React from 'react';
import {connect} from 'dva';
import Header from '../Header/Header';
import Footer from '../Footer/FooterBar';
import HelpListContent from './HelpListContent';

class HelpList extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const {helpListData, id, content, dispatch} = this.props;
		let contentProps = {helpListData, id, content, dispatch}
		return (
		    <div>
		    	<Header/>
				<HelpListContent {...contentProps}/>
		      	<Footer/>
		    </div>
		);
	}
}
function mapStateToProps({homeInfoModel}){
	const {helpListData, id, content} = homeInfoModel
	return {helpListData, id, content}
}

export default connect(mapStateToProps)(HelpList);