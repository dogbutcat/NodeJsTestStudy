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
    var words = document.getElementById('words');
    renderContent('Now Saving...');
    danMuBlocker.storage.set({
        words: words.value
    }, function () {
        renderContent('Saving Complete!');
    })
}

function restoreOptions() {
    init();
    danMuBlocker.storage.get({
        words:'66666'
    },function (items) {
        document.getElementById('words').value=items.words;
    })
}

document.addEventListener('DOMContentLoaded',restoreOptions);
document.getElementById('btnSave').addEventListener('click',saveOptions);