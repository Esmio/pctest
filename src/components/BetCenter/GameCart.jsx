import React, { Component } from 'react';
import _ from 'lodash';
import { Tooltip, Popconfirm } from 'antd';
import PropTypes from 'prop-types';
import { MDIcon } from '../General';
import { addCommas } from '../../utils';
import css from './styles/GameCart.less';

class GameCart extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.betEntries !== this.props.betEntries) {
      const { setInitialResponseState } = nextProps;
      setInitialResponseState();
    }
  }
  renderResponseMsg() {
    const { responseMessage, responseColor } = this.props;
    if (responseMessage) {
      return (
        <div className={css.gameCart_response} style={{ backgroundColor: responseColor }}>
          <p>{ responseMessage }</p>
        </div>
      );
    }
  }
  renderBody() {
    const { betEntries, onEditBetClick, repeatEntryIndex } = this.props;
    if (betEntries.length) {
      return _.map(betEntries, (entry, index) => {
        const {
          id,
          amount,
          gameMethod,
          betString,
          multiply,
          numberOfUnits,
          returnMoneyRatio
        } = entry;
        let rebate = amount * returnMoneyRatio;
        rebate = rebate.toFixed(2);
        return (
          <tr key={id} data-repeated={repeatEntryIndex === index}>        
            <td width="20%">{ gameMethod }</td>
            <td width="30%">
              <Tooltip title={betString} placement="topLeft">{ betString }</Tooltip>
            </td>
            <td width="10%" data-align="right">{ numberOfUnits }</td>
            <td width="10%" data-align="right">{ multiply }</td>
            <td width="10%" data-align="right">{ addCommas(amount) } 元</td>
            <td width="10%" data-align="right">
              { rebate < 0.001 ? '-' : `${addCommas(rebate)}元` }
            </td>
            <td width="10%" data-align="right">
              <button
                className={css.gameCart_ctrlBtn}
                onClick={onEditBetClick.bind(this, id)}
              >
                <MDIcon iconName="pencil" />
              </button>
            </td>      
          </tr>
        );
      });
    } return (
      <tr>
        <td colSpan="7" width="100%">暂无投注项</td>
        {/*<PokerCard pokerCode={[100]} />
        <PokerCard pokerCode={[200]} />
        <PokerCard pokerCode={[300]} />
        <PokerCard pokerCode={[400]} methodText="同花顺" />
        <PokerCard pokerCode={[1, 2, 3]} />
        <PokerCard pokerCode={[312, 413]} />*/}
      </tr>
    );
  }
  render() {
    const {
      onRemoveAll, betEntries,
    } = this.props;
    const popConfirmProps = {
      onConfirm: onRemoveAll,
      title: (
        <strong className={css.gameCart_popOverText}>
          <i>您确定要删除全部投注项目么？</i>
          <MDIcon iconName="emoticon-sad" />
        </strong>
      ),
      okText: '确定',
      cancel: '取消',
      placement: 'topRight'
    };
    const cartIsEmpty = !betEntries.length;
    return (
      <div className={css.gameCart}>
        <div className={css.gameCart_tableColumn}>
          { this.renderResponseMsg() }
          <table className={css.gameCart_table}>
            <thead>
              <tr>
                <td width="20%">玩法</td>
                <td width="30%">下注号</td>
                <td width="10%" data-align="right">注数</td>
                <td width="10%" data-align="right">倍数</td>
                <td width="10%" data-align="right">金额</td>
                <td width="10%" data-align="right">返水</td>
                <td width="10%" data-align="right">
                  <Popconfirm {...popConfirmProps}>
                    <button
                      disabled={cartIsEmpty}
                      className={css.gameCart_clearAllBtn}
                    >
                      全清
                    </button>
                  </Popconfirm>
                </td>
              </tr>
            </thead>
            <tbody>
              { this.renderBody() }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

GameCart.propTypes = {
  betEntries: PropTypes.array
};

export default GameCart;
