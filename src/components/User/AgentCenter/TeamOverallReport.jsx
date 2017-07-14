import React, { Component } from 'react';
import { MDIcon, LoadingBar } from '../../General';
import css from '../styles/ProfileIndex.less';

class TeamOverallReport extends Component {
  render() {
    const { awaitingResponse } = this.props;
    return (
      <div>
        <div className={css.profile_contentBody}>
          <h4 className={css.profile_formLabel}>
            团队报表
            <LoadingBar isLoading={awaitingResponse} />
          </h4>
          <div className={css.team_reports}>ddd</div>
        </div>
      </div>
    );
  }
}

export default TeamOverallReport;
