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
    }
  }
}
