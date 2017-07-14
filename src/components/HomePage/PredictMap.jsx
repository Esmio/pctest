import React from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import predictMap from '../../assets/image/prediction_map.png';
import css from '../../styles/homepage/PredictMap.less';
import {hasTrendChart} from '../../utils';
import {routerRedux} from 'dva/router';

function PredictMap({
  gameInfosRecommend,
  dispatch
}) {
  function renderSingleList(list) {
    return (
      <div className={css.predictPanel_list}>
        {
          list.map((item, key) => {
            const { gameUniqueId, gameNameInChinese } = item;
            return hasTrendChart(gameUniqueId) ? <a
                key={gameUniqueId + key}
                className={css.predictPanel_listItem}
                href={`${location.href}trend?gameUniqueId=${gameUniqueId}`}
                target="_blank"
              >
                {gameNameInChinese}
              </a> : null
          })
        }
      </div>
    );
  }
  function handleImgClick(){
    dispatch(routerRedux.push({
      pathname: 'trendpage'
    }))
  }

  function renderLists() {
    const highFreqList = [];
    const lowFreqList = [];
    _.forEach(gameInfosRecommend, (infoObject) => {
			// console.debug(infoObject);			
			if (infoObject.frequency === 'LOW') {
				lowFreqList.push(infoObject);
			} else if (infoObject.frequency === 'HIGH') {
				highFreqList.push(infoObject);
			}
		});
    return (
      <div className={css.predictPanel_rates}>
        <h5 className={css.predictPanel_label}>高频彩</h5>
        { highFreqList.length && renderSingleList(highFreqList) }
        <h5 className={css.predictPanel_label}>低频彩</h5>
        { lowFreqList.length && renderSingleList(lowFreqList) }
      </div>
    );
  }

  return (
    <div className={css.predictPanel}>
      <h2 className={css.predictPanel_header}>彩票走势图</h2>
      <img src={predictMap} alt="demo prediction map" className={css.predictPanel_banner} onClick={handleImgClick} />
      { gameInfosRecommend && renderLists(gameInfosRecommend)}
    </div>
  );
}

const mapStatesToProps = ({ gameInfosModel }) => {
  const {
		gameInfosRecommend
  } = gameInfosModel;
  return {
		gameInfosRecommend
  };
};

export default connect(mapStatesToProps)(PredictMap);
