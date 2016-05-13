/**
 * Created by oliver on 5/7/16.
 */

danMuBlocker.onMessage.addListener(function (message, sender, sendResponse) {
    var messageType = danMuBlocker.messageType,retVal;
    for (var key in messageType){
        if (message.type === key){
            retVal = messageType[key].call();
            sendResponse(JSON.stringify(retVal));
        }
    }
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    return danMuBlocker.onMessage._dispatch(msg,sender,sendResponse).indexOf(true)!=-1;
});

// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//     console.log(message);
//     console.log(sender);// Object {id: "lpkcelngfbhblegflkbhekpjbfalnejg", url: "http://www.douyu.com/214657", tab: Object, frameId: 0}
//     sendResponse({storage:'666'})
// })