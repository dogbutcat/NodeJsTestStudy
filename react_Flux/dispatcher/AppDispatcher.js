/**
 * Created by oliver on 7/18/16.
 */
var Dispatcher = require('flux').Dispatcher,
    AppDispatcher = new Dispatcher(),
    ListStore = require('../stores/ListStore');

AppDispatcher.register(function (action) {
    switch (action.actionType){
        case 'ADD_NEW_ITEM':
            ListStore.addNewItemHandler(action.text);
            ListStore.emitChange();
            break;
        default:
    }
});

module.exports = AppDispatcher;

