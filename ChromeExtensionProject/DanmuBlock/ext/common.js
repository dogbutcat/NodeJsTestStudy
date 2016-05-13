/**
 * Created by oliver on 5/7/16.
 */
(function () {
    window.danMuBlocker = {};
    var EventTarget = danMuBlocker._EventTarget = function () {
        this._listeners =[];
    };
    EventTarget.prototype = {
        addListener:function (listener) {
            if (this._listeners.indexOf(listener)==-1){
                this._listeners.push(listener);
            }
        },
        removeListener:function (listener) {
            var idx =this._listeners.indexOf(listener);
            if (idx !=-1){
                this._listeners.splice(idx, 1);
            }
        },
        /**
         * Apply Function
         * @returns {Array}
         * @private
         */
        _dispatch:function () {
            var results =[];
            var listenser = this._listeners.slice();
            for (var i = 0;i<listenser.length;i++){
                results.push(listenser[i].apply(null,arguments))
            }
            return results;
        }
    }
})();
(function () {
    danMuBlocker.onMessage = new danMuBlocker._EventTarget();
    // danMuBlocker.onMessage = chrome.runtime.onMessage;
    danMuBlocker.backgroundPage ={
        sendMessage:chrome.runtime.sendMessage,
        getWindow:function () {
            return chrome.extension.getBackgroundPage();
        }
    };
    danMuBlocker.storage = chrome.storage.sync;
})();