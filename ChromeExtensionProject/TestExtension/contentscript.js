/**
 * Created by oliver on 5/8/16.
 */
var port = chrome.runtime.connect();

window.addEventListener("message",function (event) {
    if (event.source != window){
        return;
    }

    if  (event.data.type && (event.data.type == "FROM_PAGE")){
        console.log('Content script recevied: '+ event.data.type);
        port.postMessage(event.data.text);
    }
},false)