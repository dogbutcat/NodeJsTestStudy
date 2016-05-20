/**
 * Created by oliver on 5/12/16.
 */
(function () {
    danMuBlocker.messageType = {
        getData: function () {
            var data = new storageData();
            danMuBlocker.storage.get({words: '666',level:'5'}, function (item) {
                data.blockWords = item.words;
                data.level = item.level;
            });

            return data;
        }
    }
})();

/**
 * messageModel
 */
function storageData() {
    this.blockWords = '';
    this.level = '';
}