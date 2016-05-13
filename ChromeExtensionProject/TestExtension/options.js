/**
 * Created by oliver on 5/6/16.
 */
//Saves options to chrome.storage
function save_options() {
    var color = document.getElementById('color').value;
    var likesColor = document.getElementById('like').checked;
    chrome.storage.sync.set({
            favoriteColor: color,
            likesColor: likesColor
        },
        //     function () {
        //     //Update status to let user know options were saved
        //     var status = document.getElementById('status');
        //     status.textContent='Options saved.';
        //     setTimeout(function () {
        //         status.textContent='';
        //     },750);
        // }
        function () {
            var status = document.getElementById('status');
            status.textContent = 'Operation Complete!';
            setTimeout(function () {
                status.textContent='';
            },1000);
        }
    );
}

//Restore select box and checkbox status using the preferences
//stored in chrome.storge.
function restore_options() {
    //Use default value color = 'red' and likeColor = true
    chrome.storage.sync.get({
        favoriteColor: 'red',
        likesColor: true
    }, function (items) {
        document.getElementById('color').value = items.favoriteColor;
        document.getElementById('like').checked = items.likesColor;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);