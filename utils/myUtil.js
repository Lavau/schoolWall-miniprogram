/**
 * 生成 uuid
 */
const uuid = () => {
  function id() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (id() + id() + id() + id() + id() + id() + id() + id());
}

/**
 * 时间戳转换为：秒前、分钟前、小时前、YYYY-MM-dd HH:mm
 * @param {*} date 格林威治时间的毫秒数
 */
const timeStamp = date => {
  // 获取当前时间戳
  let newDate = new Date();

  // 计算时间的差值
  let timeDifferenceValue = newDate.getTime() - date;
  let second = Math.floor(timeDifferenceValue / 1000);
  let minute = Math.floor(second / 60);
  let hour = Math.floor(minute / 60);

  // 判断后，返回相应的值
  if (second < 60) {
    return second + "秒前";
  } else if (minute < 60) {
    return minute + "分钟前";
  } else if (hour < 24) {
    return hour + "小时前";
  } else {
    return new Date(date + 8 * 3600 * 1000).toJSON().substr(0, 19).replace('T', ' ');
  }
}

module.exports = {
  uuid: uuid,
  timeStamp: timeStamp
}