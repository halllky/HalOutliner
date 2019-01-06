export default class {
  constructor (type, value, addDt) {
    this.type = typeof type === 'undefined' ? 0 : type;
    this.value = typeof value === 'undefined' ? '' : value;
    this.addDt = typeof addDt === 'undefined' ? new Date() : addDt;
    this.todo = 0;
    this.children = [];
  }

  formatAddDate (format) {
    // https://qiita.com/osakanafish/items/c64fe8a34e7221e811d0
    if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
    format = format.replace(/YYYY/g, this.addDt.getFullYear());
    format = format.replace(/MM/g, ('0' + (this.addDt.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ('0' + this.addDt.getDate()).slice(-2));
    format = format.replace(/hh/g, ('0' + this.addDt.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + this.addDt.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + this.addDt.getSeconds()).slice(-2));
    if (format.match(/S/g)) {
      var milliSeconds = ('00' + this.addDt.getMilliseconds()).slice(-3);
      var length = format.match(/S/g).length;
      for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
    }
    return format;
  }

  hasTodo () {
    function isTodo (parent) {
      if (parent.todo === 1) {
        return true;
      }
      if (parent.children !== undefined) {
        let i = parent.children.filter(c => isTodo(c));
        if (i.length > 0) return true;
      }
      return false;
    }
    return isTodo(this);
  }
}
