import React from 'react';
import { routerRedux } from 'dva/router';
import css from '../../styles/homepage/tutorialList.less';
import { Row } from '../General';

class TutorialList extends React.Component {
  handleLinkClick(id, content) {
    const { dispatch } = this.props;
    dispatch({ type: 'homeInfoModel/updateState', payload: { id, content } });
    dispatch(routerRedux.push({
      pathname: 'helplist'
    }));
  }
  renderHelpListItem() {
    const { helpListData } = this.props;
    if (!helpListData) return null;
    let arr = [];
    for (const item in helpListData) {
      if (item.cateId && item.cateId === 1) {
        arr = arr.helpList;
      }
    }
    const nodes = arr.map((item) => {
      const { id, title, content } = item;
      return (<li className={css.tutorial_listItem} key={id}>
        <a
          className={css.permalink} onClick={this.handleLinkClick.bind(this, id, content)}
        >
          {title}
        </a>
      </li>);
    });
    return nodes;
  }
  render() {
    return (
      <Row className={css.tutorial}>
        <h3 className={css.tutorial_header}>新手指导</h3>
        <ul className={css.tutorial_list}>
          { this.renderHelpListItem() }
        </ul>
      </Row>
    );
  }
}

export default TutorialList;
