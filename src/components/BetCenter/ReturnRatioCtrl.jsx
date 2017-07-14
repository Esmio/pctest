import React, { Component } from 'react';
import { addCommas } from '../../utils';
import { RangeInput } from '../General';
import css from './styles/RatioCtrl.less';

class ReturnRatioCtrl extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.thisMethodPrizeSetting !== nextProps.thisMethodPrizeSetting) {
      this.mapPropToStates(nextProps);
    }
  }
  
  mapPropToStates({ thisMethodPrizeSetting }) {
    this.setState({ ...thisMethodPrizeSetting });
  }
  renderScene() {
    const {
      getAmountPerUnit, returnMoneyRatio, onRangeChange, getEntriesTotal,
      thisMethodPrizeSetting
    } = this.props;
    if (thisMethodPrizeSetting) {
      const { prizeSettings } = thisMethodPrizeSetting;
      const ratio = ((100 - returnMoneyRatio) / 100).toFixed(2);
      const prize = _.maxBy(prizeSettings, (p) => p.prizeAmount);
      let prizeAmount = prize.prizeAmount * ratio;
      prizeAmount = prizeAmount.toFixed(2);
      let amount = getAmountPerUnit() * prizeAmount;
      amount = amount.toFixed(2);
      const { totalAmount, totalUnits } = getEntriesTotal();
      return (
        <div>
          <div className={css.ratioCtrl_paragraph}>
            <div className={css.ratioCtrl_label}>
              <p>总注数</p>
            </div>
            <div className={css.ratioCtrl_content}>
              <p>{totalUnits}</p>
            </div>
          </div>
          <div className={css.ratioCtrl_paragraph}>
            <div className={css.ratioCtrl_label}>
              <p>总金额</p>
            </div>
            <div className={css.ratioCtrl_content}>
              <p>{addCommas(totalAmount)} 元</p>
            </div>
          </div>
          <div className={css.ratioCtrl_paragraph}>
            <div className={css.ratioCtrl_label}>
              <p>当前返点</p>
            </div>
            <div className={css.ratioCtrl_content}>
              <p>{returnMoneyRatio}%</p>
            </div>
          </div>
          <div className={css.ratioCtrl_rangeInput}>
            <RangeInput
              style={{ marginBottom: 0 }}
              onDrag={({ target }) => onRangeChange(target.value)}
              onChange={({ target }) => onRangeChange(target.value)}
              minLabel="0%"
              maxLabel="10%"
              indicatorLabel={`(${returnMoneyRatio}%)`}
              name="prizeGroup"
              min={0}
              max={10}
              step={0.1}
              value={returnMoneyRatio}
            />
          </div>
          <div className={css.ratioCtrl_paragraph}>
            <div className={css.ratioCtrl_label}>
              <p>最高奖金</p>
            </div>
            <div className={css.ratioCtrl_content}>
              <p>{addCommas(amount)} 元</p>
            </div>
          </div>
          <p className={css.ratioCtrl_paragraph}>
            <span className={css.ratioCtrl_label}>最高赔率</span>
            <span className={css.ratioCtrl_content}>{prizeAmount}</span>
          </p>
        </div>
      );
    } return null;
  }
  render() {
    return (
      <div className={css.ratioCtrl}>
        { this.renderScene() }
      </div>
    );
  }
}

export default ReturnRatioCtrl;
