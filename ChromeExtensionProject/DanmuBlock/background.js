/**
 * Created by oliver on 5/7/16.
 */
"use strict";
var data;

!function getOptions() {
    danMuBlocker.storage.get({words: '666', level: '5'}, function (item) {
        data = item;
    });
}();
danMuBlocker.onMessage.addListener(function (msg, sender, sendResponse) {

    switch (msg.type) {
        case 'getData':
            sendResponse(JSON.stringify(data));
            break;
    }
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    return danMuBlocker.onMessage._dispatch(msg, sender, sendResponse).indexOf(true) != -1;
});

// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//     console.log(message);
//     console.log(sender);// Object {id: "lpkcelngfbhblegflkbhekpjbfalnejg", url: "http://www.douyu.com/214657", tab: Object, frameId: 0}
    // sendResponse({storage:'666'})
    // sendResponse({blockWords:"66666"});
// })