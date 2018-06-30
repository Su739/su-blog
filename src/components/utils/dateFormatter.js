const dateMap = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec'
};

const dateFormatter = (str) => {
  const arr = str.slice(0, 10).split('-');
  return `${dateMap[arr[1]]} ${arr[2]}, ${arr[0]}`;
};

export default dateFormatter;
