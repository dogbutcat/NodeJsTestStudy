/**
 * Created by oliver on 6/15/16.
 */
var React = require('react');

module.exports = React.createClass({
    render:function () {
        return (
            <button onClick={this.props.onToggle} id="add-question-btn" className="btn btn-success">Add Question</button>
        )
    }
});