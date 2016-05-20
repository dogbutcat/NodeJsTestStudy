/**
 * Created by oliver on 5/7/16.
 */
/**
 * This is Used to Rende Page
 * @param statusText Text need to Show
 */
function renderContent(statusText) {
    document.getElementById('status').textContent = statusText;
}

/**
 * Inition
 */
function init() {
    renderContent('');
}

/**
 * Save Block Words
 */
function saveOptions() {
    var words = document.getElementById('words'),level=document.getElementById('usrLevel');
    renderContent('Now Saving...');
    danMuBlocker.storage.set({
        words: words.value,
        level: level.value
    }, function () {
        renderContent('Saving Complete!');
    })
}

function restoreOptions() {
    init();
    danMuBlocker.storage.get({
        words:'66666', // Default Value
        level:'5'
    },function (items) {
        document.getElementById('words').value=items.words;
        document.getElementById('usrLevel').value = items.level;
    })
}

document.addEventListener('DOMContentLoaded',restoreOptions);
document.getElementById('btnSave').addEventListener('click',saveOptions);