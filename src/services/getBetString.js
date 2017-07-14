import _ from 'lodash';

export function getBetString({ thisBetObj }, { sections, set }) {
  let thisBetString = '';
  _.forEach(sections, (section) => {
    if (thisBetObj[section]) {
      let sectionStr = '';
      _.forEach(set, (betStr) => {
        if (thisBetObj[section].indexOf(betStr) > -1) {
          sectionStr = `${sectionStr} ${betStr}`;
        }
      });
      sectionStr = _.trim(sectionStr);
      thisBetString = `${thisBetString}${sectionStr}|`;
    } else {
      thisBetString = `${thisBetString}|`;
    }
  });
  thisBetString = _.trim(thisBetString);
  return thisBetString;
}
