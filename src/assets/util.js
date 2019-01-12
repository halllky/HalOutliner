/* eslint-disable no-undef */
export default {
  methods: {
    isAndroid () {
      return typeof cordova !== 'undefined';
    },
    downloadForAndroid (blob, fileName) {
      function execDownload (i) {
        let modifiedName = fileName + (i === 0 ? '' : '(' + i + ')') + '.json';
        window.resolveLocalFileSystemURL(
          cordova.file.externalRootDirectory + 'Download/' + modifiedName,
          () => {
            // case when same name file exists
            execDownload(i + 1);
          },
          () => {
            const fr = new FileReader();
            fr.onload = () => {
              new FileTransfer().download(
                fr.result,
                cordova.file.externalRootDirectory + 'Download/' + modifiedName,
                function (fileEntry) {
                  alert('download complete to \n' + fileEntry.fullPath);
                },
                function (error) {
                  alert('download error code: ' + error.code);
                }
              );
            }
            fr.readAsDataURL(blob);
          }
        );
      }
      const per = cordova.plugins.permissions;
      per.checkPermission(
        per.WRITE_EXTERNAL_STORAGE,
        function (statusBeforeRequest) {
          if (statusBeforeRequest.hasPermission) {
            execDownload(0);
          } else {
            per.requestPermission(
              per.WRITE_EXTERNAL_STORAGE,
              function (statusAfterRequest) {
                if (statusAfterRequest.hasPermission) execDownload(0);
              }
            );
          }
        }
      );
    },
    scrollTo (element) {
      const rect = element.getBoundingClientRect();
      const startY = window.pageYOffset;
      const destY =
        rect.top +
        rect.height / 2 -
        Math.max(document.documentElement.clientHeight, window.innerHeight || 0) / 2 + // view height / 2
        window.pageYOffset +
        rect.height; // <- memo appears from adove because of css transition
      const timeSpan = 10;
      let progress = 0;
      const move = function () {
        progress++;
        const y = startY + (destY - startY) * progress / timeSpan;
        window.scrollTo(0, y);
        if (progress < timeSpan) requestAnimationFrame(move);
      }
      requestAnimationFrame(move);
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
