/**
 * Created by oliver on 7/18/16.
 */
"use strict";
var React = require('react');

var MyButton = React.createClass({
    render(){
        var items = this.props.items,
            itemsHtml = items.map((listItem,index)=>{
                return <li key={index}>{listItem}</li>
            });
        console.log(this.props.items);
        return <div>
            <ul>{itemsHtml}</ul>
            <button onClick={this.props.onClick}>New Item</button>
        </div>
    }
});

module.exports = MyButton;