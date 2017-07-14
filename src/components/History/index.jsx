import React, { Component } from 'react';
import { connect } from 'dva';
import HistoryTable from './HistoryTable';
import Header from '../Header/Header';
import Footer from '../Footer/FooterBar';

class HistoryIndex extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch.bind(this);
    this.getAllHistory = this.getAllHistory.bind(this);
  }

  componentDidMount() {
    this.getAllHistory();
  }

  componentWillUnmount() {
    this.dispatch({ type: 'betCenter/initializeState', payload: ['thisGameId'] });
    clearTimeout(this.timer);
  }

  getAllHistory() {
    const { dispatch } = this.props;
    clearTimeout(this.timer);
    dispatch({ type: 'gameInfosModel/getAllHistory' });
    this.timer = setTimeout(() => {
      this.getAllHistory();
    }, 20000);
  }

  render() {
    const {
      allHistory, dispatch, awaitingResponse, thisGameHistory, thisGameId, resultLimit
    } = this.props;
    const tableProps = {
      dispatch,
      awaitingResponse,
      thisGameHistory,
      allHistory,
      thisGameId,
      resultLimit
    };
    return (
      <div>
        <Header />
        <HistoryTable {...tableProps} />
        <Footer />
      </div>
    );
  }
}

const mapStatesToProp = ({ gameInfosModel, betCenter }) => {
  const { thisGameId, resultLimit } = betCenter;
  return { ...gameInfosModel, thisGameId, resultLimit };
};

export default connect(mapStatesToProp)(HistoryIndex);
