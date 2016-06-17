/**
 * Created by oliver on 6/15/16.
 */
var React = require('react');
var QuestionItem = require('./QuestionItem');

module.exports = React.createClass({
    render:function () {
        var questions = this.props.questions;
        if (!Array.isArray(questions)) throw new Error('Argument is not a Array');
        var questionComps = questions.map(function (val) {
            return <QuestionItem key={val.id} voteCount={val.voteCount}
                                 title={val.title} description={val.description} 
                                 onVote={this.props.onVote} questionKey={val.id}/>
        }.bind(this));

        return (
            <div id="questions">
                {questionComps}
            </div>
        )
    }
});