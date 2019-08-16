var projectName = "ShengDaZYYH";
let ls = {
  setter: function(key, value, time) {
    var _key = projectName + "_" + key;
    wx.removeStorageSync(_key);
    var isObject = value instanceof Object,
      _time = new Date().getTime(),
      _age = time;

    // 如果不是对象，新建一个对象把 value 存起来
    if (!isObject) {
      var b = value;
      value = {};
      value._value = b;
    }
    // 加入时间
    value._time = _time;
    // 过期时间
    value._age = _time + _age;
    // 是否一个对象
    value._isObject = isObject;
    wx.setStorageSync(_key, JSON.stringify(value));
    return this;
  },



  getter: function(key) {
    var _key = projectName + "_" + key;
    var isTimeout = function() {
      var isExpire = false,
        value = wx.getStorageSync(_key),
        now = new Date().getTime();
      if (value) {
        value = JSON.parse(value);
        // 当前时间是否大于过期时间
        isExpire = now > value._age;
      } else {
        isExpire = true
        // 没有值也是过期
      }
      return isExpire;
    };
    var isExpire = isTimeout();
    var value = wx.getStorageSync(_key);
    if (isExpire) {

      value = wx.removeStorageSync(_key);
    } else {
      value = JSON.parse(value);
      value = value._value;
    }
    return value;
  },

  del: function(key) {
    var _key = projectName + "_" + key;
    wx.removeStorageSync(_key);
  }
}

module.exports = { ls }