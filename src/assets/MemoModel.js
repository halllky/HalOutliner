export default class {
  constructor (type, value, addDt) {
    this.type = type;
    this.value = value;
    this.addDt = typeof addDt === 'undefined' ? new Date() : addDt;
    this.children = [];
  }
}
