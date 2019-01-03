/* eslint no-undef: 0 */
module.exports = {
  isAndroid () {
    return typeof cordova !== 'undefined';
  }
}
