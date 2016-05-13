/**
 * Created by oliver on 5/8/16.
 */
/**
 * React when a browser action's icon is clicked
 */
chrome.browserAction.onClicked.addListener(function (tab) {
    var viewTabUrl = chrome.extension.getURL('image.html');
    var imageUrl = 'icon-19.png';//'http://www.imqiyu.com/content/uploadfile/201407/c3381406125471.png';

    //Look through all the pages in this extension to find one we can use
    var views = chrome.extension.getViews();
    for (var i = 0;i<views.length;i++){
        var view = views[i];

        // if this view has the right URL and hasn't been used yet...
        if (view.location.href == viewTabUrl &&!view.imageAlreadySet){

            // ...call one of its function and set a property
            view.setImageUrl(imageUrl);
            view.imageAlreadySet = true;
            break; //Done
        }else{
            chrome.tabs.create({url:'image.html'})
        }
    }
});
chrome.browserAction.setBadgeText({text:'2'});