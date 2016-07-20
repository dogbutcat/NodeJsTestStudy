/**
 * Created by oliver on 7/18/16.
 */
var AppDispatcher = require('../dispatcher/AppDispatcher');

var ButtonAction = {
    addNewItem:function (text) {
        AppDispatcher.dispatch({
            actionType:'ADD_NEW_ITEM',
            text: text
        })
    }
};

module.exports = ButtonAction;