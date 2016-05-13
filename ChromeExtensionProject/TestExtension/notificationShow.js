/**
 * Created by oliver on 5/9/16.
 */
var options ={
    type:"basic",
    title:"This is Created by Extension Notification!",
    message:"Show it Up!",
    iconUrl:"icon.png"
};

chrome.notifications.create(options,function () {
    console.log('Operation Complete!')
});