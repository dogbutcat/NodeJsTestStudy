/**
 * Created by oliver on 5/9/16.
 */
var observer_clist = new MutationObserver(function (mutations) {
    mutations.forEach(operateMutation)
}), config = {
    childList: true
    // attributes: true,
    // characterData:true
}, target, targetList = ['.c-list', '#chat_line_list'];

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

target = setObserverTarget(targetList, window.document);
observer_clist.observe(target, config);

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

            (textContent = setObserverTarget(chatList, singleNode)) && (textContent = textContent.innerText);

            if (checkWords(textContent)) {
                singleNode.removeNode();
                return true;
            }
        }
    }
}

function checkWords(text) {
    if (text != null) {
        var matchReg;
        matchReg = text.match(/(.)\1{3,}/g);
        if (text.length > 10 || matchReg != null) {
            return true;
        }
        return false;
    }
    return false;
}