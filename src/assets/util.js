/* eslint-disable no-undef */
export default {
  methods: {
    isAndroid () {
      return typeof cordova !== 'undefined';
    },
    downloadForAndroid (blob, fileName) {
      function execDownload () {
        const fr = new FileReader();
        fr.onload = () => {
          new FileTransfer().download(
            fr.result,
            cordova.file.externalRootDirectory + 'Download/' + fileName,
            function (fileEntry) {
              alert('download complete to ' + fileEntry.fullPath);
            },
            function (error) {
              alert('download error code: ' + error.code);
            }
          );
        }
        fr.readAsDataURL(blob);
      }
      const per = cordova.plugins.permissions;
      per.checkPermission(
        per.WRITE_EXTERNAL_STORAGE,
        function (statusBeforeRequest) {
          if (statusBeforeRequest.hasPermission) {
            execDownload();
          } else {
            per.requestPermission(
              per.WRITE_EXTERNAL_STORAGE,
              function (statusAfterRequest) {
                if (statusAfterRequest.hasPermission) execDownload();
              }
            );
          }
        }
      );
    },
    formatDate (date, format) {
      // https://qiita.com/osakanafish/items/c64fe8a34e7221e811d0
      if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
      format = format.replace(/YYYY/g, date.getFullYear());
      format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
      format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
      format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
      format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
      format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
      if (format.match(/S/g)) {
        var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
        var length = format.match(/S/g).length;
        for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
      }
      return format;
    }
  }
}
