/**
 * Created by oliver on 7/18/16.
 */
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ListStore = assign({},EventEmitter.prototype,{
    items:['jack','jason'],

    getAll:function () {
        return this.items;
    },

    addNewItemHandler:function (text) {
        this.items.push(text);
    },

    emitChange:function () {
        this.emit('change');
    },

    addChangeListener:function (cb) {
        this.on('change',cb);
    },

    removeChangeListener:function (cb) {
        this.removeListener();
    }
});

module.exports = ListStore;