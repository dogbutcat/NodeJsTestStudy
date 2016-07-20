/**
 * Created by oliver on 7/18/16.
 */
"use strict";
var React = require('react'),
    MyButton = require('./MyButton.jsx'),
    ListStore = require('../stores/ListStore'),
    ButtonAction = require('../actions/ButtonAction');

var MyButtonController = React.createClass({
    getInitialState(){
        return {
            items: ListStore.getAll()
        }
    },
    componentDidMount(){
        ListStore.addChangeListener(this._onChange)
    },
    componentWillUnmount(){
        ListStore.removeChangeListener(this._onChange)
    },
    _onChange(){
        this.setState({
            items:ListStore.getAll()
        })
    },
    createNewItem(e){
        ButtonAction.addNewItem('New Item')
    },
    render(){
        return <MyButton items = {this.state.items} onClick={this.createNewItem}></MyButton>
    }
});

module.exports = MyButtonController;
