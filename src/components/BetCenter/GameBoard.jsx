import React, { Component } from 'react';
import css from './styles/GameBoard.less';
import { type as TYPE } from '../../utils';

class Gameboard extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      全: {},
      大: {},
      小: {},
      奇: {},
      偶: {},
      清: {}
    };
    this.dispatch = this.props.dispatch.bind(this);
    this.splitGroupSet = this.splitGroupSet.bind(this);
    this.isNumeric = this.isNumeric.bind(this);
  }
  componentWillMount() {
    this.splitGroupSet(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.splitGroupSet(nextProps);
  }
  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  splitGroupSet({ thisMethodSetting }) {
    if (thisMethodSetting) {
      const { gameRules } = thisMethodSetting;
      const { sections, set, isGroupBtn } = gameRules;
      const all = {};
      const largeGroup = {};
      const smallGroup = {};
      const oddGroup = {};
      const evenGroup = {};
      const emptyGroup = {};
      _.forEach(sections, (section, sectionIndex) => {
        all[section] = [];
        largeGroup[section] = [];
        smallGroup[section] = [];
        oddGroup[section] = [];
        evenGroup[section] = [];
        emptyGroup[section] = [];
        const bets = set[sectionIndex] || set[0];
        const setHalfIndex = Math.round(bets.length / 2);
        
        _.forEach(bets, (number, index) => {
          let bet = number;
          if (isGroupBtn) {
            bet = number.displayText;
          }
          all[section].push(bet);
          const int = parseInt(bet, 10);
          const isNumber = this.isNumeric(bet);
          const isSymbolic = _.indexOf(TYPE.SYMBOLICS, number) > -1;
          const isOdd = 
            int % 2 === 1 ||
            /单/i.test(bet) ||
            (isSymbolic && (index + 1) % 2 === 1);
          const isEven =
            int % 2 === 0 ||
            /双/i.test(bet) ||
            (isSymbolic && (index + 1) % 2 === 0);
          const isBig = 
            /大/i.test(bet) || 
            (isNumber && index >= setHalfIndex) ||
            (isSymbolic && index >= setHalfIndex);
          const isSmall = 
            /小/i.test(bet) || 
            (isNumber && index < setHalfIndex) ||
            (isSymbolic && index < setHalfIndex);
          if (isOdd) {
            oddGroup[section].push(bet);
          }
          if (isEven) {
            evenGroup[section].push(bet);
          }
          if (isBig) {
            largeGroup[section].push(bet);
          }
          if (isSmall) {
            smallGroup[section].push(bet);
          }
        });
      });
      
      this.setState({
        全: { ...all },
        大: { ...largeGroup },
        小: { ...smallGroup },
        奇: { ...oddGroup },
        偶: { ...evenGroup },
        清: { ...emptyGroup }
      });
    }
  }
  renderControllerBtns(section) {
    const { thisBetObj, onControllerClick } = this.props;
    
    return _.map(this.state, (group, groupName) => {
      const thisSection = thisBetObj[section];
      const thisGroup = group[section];
      const btnProps = {
        className: css.gameboard_ctrlBtn,
        onClick: onControllerClick.bind(this, { section, group: thisGroup }),
        key: groupName,
        disabled: thisGroup !== undefined && !thisGroup.length && groupName !== '清',
        'data-active': (
          thisGroup &&
          thisSection &&
          _.isEqual(thisSection.sort(), thisGroup.sort()) &&
          groupName !== '清'
        )
      };
      return (
        <button {...btnProps}>
          { groupName }
        </button>
      );
    });
  }
  renderArrayBtn(section, set) {
    const { thisBetObj, onBetClick } = this.props;
    return _.map(set, (item) => {
      const { displayText, color, numberArrays } = item;
      const btnIsActive = thisBetObj[section] && thisBetObj[section].indexOf(displayText) > -1;
      const activeStyle = {
        color: 'white', backgroundColor: color
      };
      const style = {
        color, borderColor: color
      };
      const btnProps = {
        className: css.gameboard_groupBtn,
        onClick: onBetClick.bind(this, { section, bet: displayText }),
        key: displayText,
        'data-active': btnIsActive,
        style: btnIsActive ? activeStyle : style
      };
      const btnTextProps = {
        className: css.gameboard_btnDisplayText,
        style: btnIsActive ? activeStyle : style
      };
      return (
        <button {...btnProps}>
          <span {...btnTextProps}>
            { displayText }
          </span>
          <span className={css.gameboard_btnNums} style={{ borderColor: color }}>
            { 
              _.map(numberArrays, (number) => {
                const btnSpanProps = {
                  style: { color: btnIsActive ? 'white' : color },
                  key: number,
                  className: css.gameboard_btnNum
                };
                return (
                  <span {...btnSpanProps}>
                    { number }
                  </span>
                );
              })
            }
          </span>
        </button>
      );
    });
  }
  renderSection({ section, sectionIndex }) {
    const { thisMethodSetting, thisBetObj, onBetClick, thisMethodPrizeSetting } = this.props;
      const { prizeSettings } = thisMethodPrizeSetting;
    const { gameRules } = thisMethodSetting;
    const { isGroupBtn } = gameRules;
    const { set } = gameRules;
    const bets = set[sectionIndex] || set[0];
    if (isGroupBtn) {
      return this.renderArrayBtn(section, bets);
    }
    return _.map(bets, (bet) => {
      let betPrize = '';
      if (prizeSettings && prizeSettings.length > 1) {
        const { symbolic } = thisMethodPrizeSetting;
        const symbolicName = TYPE[`SYMBOLIC_${symbolic}`];
        if (symbolicName) {
          if (bet === symbolicName) {
            betPrize = _.find(prizeSettings, (p) => (
              p.prizeNameForDisplay.indexOf('当年肖') > -1 ||
              p.prizeNameForDisplay.indexOf(bet) > -1
            ));
          } else {
            betPrize = _.find(prizeSettings, (p) => (
              (
                p.prizeNameForDisplay.indexOf('当年肖') < 0 &&
                p.prizeNameForDisplay.indexOf(symbolicName) < 0
              ) ||
              p.prizeNameForDisplay.indexOf(bet) > -1 ||
              p.prizeNameForDisplay.indexOf('非当年肖') > -1
            ));
          }
        } else {
          betPrize = _.find(prizeSettings, ['prizeNameForDisplay', bet]);
        }
      }
      const btnProps = {
        style: betPrize ? { marginBottom: '1.5rem' } : {},
        className: css.gameboard_btn,
        onClick: onBetClick.bind(this, { section, bet }),
        key: `${section}__${bet}`,
        'data-active': thisBetObj[section] && thisBetObj[section].indexOf(bet) > -1
      };
      
      return (
        <button {...btnProps}>
          { bet }
          {
            betPrize ? 
            <span className={css.gameboard_btnPrize}>{ betPrize.prizeAmount }</span>
            : null
          }
        </button>
      );
    });
  }
  render() {
    const { thisMethodSetting, thisMethodPrizeSetting } = this.props;
    if (thisMethodPrizeSetting && thisMethodSetting) {
      const { gameRules } = thisMethodSetting;
      const { sections } = gameRules;
      return (
        <div className={css.gameboard}>
          {
            _.map(sections, (section, sectionIndex) => {
              return (
                <div className={css.gameboard_section} key={section}>
                  <span className={css.gameboard_sectionLabel}>{ section }</span>
                  <div className={css.gameboard_btns}>
                    { this.renderSection({ section, sectionIndex }) }
                  </div>
                  <div className={css.gameboard_ctrlBtns}>
                    { this.renderControllerBtns(section) }
                  </div>
                </div>
              );
            })
          }
        </div>
      );
    } return null;
  }
}

export default Gameboard;
