/**
 * Created by oliver on 5/9/16.
 */
var observer_clist = new MutationObserver(function (mutations) {
    mutations.forEach(operateMutation)
}), config = {
    childList: true
    // attributes: true,
    // characterData:true
}, target, targetList = ['.c-list', '#chat_line_list'], blockConfig={};

target = setObserverTarget(targetList, window.document);

/**
 * Get storage Initalize
 */
!function init() {
    chrome.runtime.sendMessage({type: 'getData'}, function (response) {
        // console.log(response);
        blockConfig = JSON.parse(response);

        observer_clist.observe(target, config);
        // console.log(blockConfig);
    })
}();

// while (typeof blockConfig.level == 'undefined'){
//     init();
// }

/**
 * Check if Chat list is .c-list or #chat_line_list
 * @param tList
 * @return HTMLNode
 */
function setObserverTarget(tList, htmlNode) {
    var target;
    for (var i = 0; i < tList.length; i++) {
        if (htmlNode.querySelector(tList[i]) != null) {
            target = htmlNode.querySelector(tList[i]);
            break;
        }
    }
    return target;
}


/**
 * FormatedNode Module
 * @param node HTMLNode
 */
function formatedNode(node) {
    this.tempNode = node;
}

formatedNode.prototype = {
    querySelector: function (a) {
        return this.tempNode && this.tempNode.querySelector(a)
    },
    removeNode: function () {
        var delBool = false;
        try {
            removeNodeinList(this.tempNode);
            return true;
        } catch (ex) {
            console.log(ex);
            return delBool;
        }
    },
    getQueryText: function (a) {
        return this.tempNode && this.tempNode.querySelector(a).innerText ?
            this.tempNode.querySelector(a).innerText : '';
    },
    hasPresentImg: function () {
        return this.tempNode && this.tempNode.querySelector('img.lw-imgs') != null ? true : false;
        // return this.tempNode && this.tempNode.getElementsByClassName('lw-imgs').length > 0 ? true : false
    },
    isWelcome: function () {
        return this.tempNode && this.tempNode.querySelector('span.c-wel') != null ? true : false
    },
    isGetPresent: function () {
        return this.tempNode && this.tempNode.querySelector('img.cj-img') != null ? true : false
    },
    userLevel: function (lvl) {
        // var userNode = (this.tempNode && this.tempNode.querySelector('a.user-level').querySelector('img').getAttribute('title')), result;
        var $userNode = $(this.tempNode), result;
        result = $userNode.data('level');
        return result < parseInt(lvl);
    }
};

function removeNodeinList(a) {
    a.parentNode.removeChild(a)
}

function operateMutation(mutation) {
    if (mutation.addedNodes[0]) {
        var singleNode = new formatedNode(mutation.addedNodes[0]), textContent, isPresent, isWelcome;
        var chatList = ['span.text-cont', 'span.text_cont'];
        // console.log(singleNode);
        if (!(singleNode.hasPresentImg()) && !(singleNode.isWelcome())) {
            // textContent = singleNode.getQueryText('span.text-cont');
            if (singleNode.isGetPresent()) {
                singleNode.removeNode();
                return true;
            }

            if(singleNode.userLevel(blockConfig.level)){
                singleNode.removeNode();
                return true;
            }

            (textContent = setObserverTarget(chatList, singleNode)) && (textContent = textContent.innerText);

            if (checkWords(textContent)) {
                singleNode.removeNode();
                return true;
            }
        } else if (singleNode.hasPresentImg()) {
            singleNode.removeNode();
        }
    }
}

/**
 * Check word in defaults and manual setup
 * @param text
 * @returns {boolean}
 */
function checkWords(text) {
    if (text != null) {
        var matchReg;
        matchReg = text.match(/(.{2,})\1{1,}|(.)\2{3,}/ig); // single word Repeat for trible time or two word repeat one times to Block the chat
        if (text.length > 12 || matchReg != null) {
            return true;
        } else if (blockConfig.words != "") {
            var regpiece = new RegExp(blockConfig.words, 'ig');
            matchReg = text.match(regpiece);
            if (matchReg != null) {
                return true;
                // break; // Cant reach the code here
            }
        }
        return false;
    }
    return false;
}

/**
 * Temporary for storage Change Event cuz content_script blockConfig dont like storage file
 */
chrome.storage.onChanged.addListener(function (a, b) { // a is submitted the changed one
    for (var key in a) {
        switch (key) {
            case "words":
                words = a.words.newValue;
                break;
            case "level":
                blockConfig.level = a.level.newValue;
                break;
        }
    }
});