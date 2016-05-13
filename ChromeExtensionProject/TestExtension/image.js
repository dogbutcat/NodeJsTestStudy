/**
 * Created by oliver on 5/8/16.
 */
document.getElementById('theButton').addEventListener('click',function () {
    window.postMessage({type:"FROM_PAGE",text:"Hello from the webpage!"},"*")
},false);