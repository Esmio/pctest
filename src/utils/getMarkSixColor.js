/**
 * Created by sean.junior-jx on 2017/5/30.
 * Modify by louis-jx on 2017/710.
 */

export function getMarkSixColor(number) {
  const numStr = `${number}`;
  if (number) {
    const redNumbers = [
      '01', '02', '07', '08', '12',
      '13', '18', '19', '23', '24',
      '29', '30', '34', '35', '40',
      '45', '46', 
    ];
    const blueNumbers = [
      '03', '04', '09', '10', '14',
      '15', '20', '25', '26', '31',
      '36', '37', '41', '42', '47',
      '48'
    ];
    const greenNumbers = [
      '05', '06', '11', '16', '17',
      '21', '22', '27', '28', '32',
      '33', '38', '39', '43', '44',
      '49'
    ];
    if (redNumbers.indexOf(numStr) > -1) {
      return 'red';
    } else if (blueNumbers.indexOf(numStr) > -1) {
      return 'blue';
    } else if (greenNumbers.indexOf(numStr) > -1) {
      return 'green';
    } else {
      console.warn(`${numStr} 六合彩号码未识别`);
    }
  }
}
