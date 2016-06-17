/**
 * Created by oliver on 6/15/16.
 */
var React = require('react');
var _ = require('lodash');
var ShowAddButton = require('./ShowAddButton');
var QuestionForm = require('./QuestionForm');
var QuestionList = require('./QuestionList');

module.exports = React.createClass({
    getInitialState: function () {
        var questions = [{
                id: 1,
                title: 'This is a Sample Question!',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae dolorum nesciunt recusandae vitae voluptatum. ' +
                'Atque dicta dignissimos dolores, dolorum eligendi, ipsum itaque magni maiores nihil nostrum placeat repudiandae tempora voluptate?',
                voteCount: 22
            },
            {
                id:2,
                title:'This is a Sample Question!',
                description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae dolorum nesciunt'+
                'recusandae vitae voluptatum. Atque dicta dignissimos dolores, dolorum eligendi,'+
            'ipsum itaque magni maiores nihil nostrum placeat repudiandae tempora voluptate?',
                voteCount:12
            }
        ];
        return {
            questions:questions,
            formDisplay:false
        }
    },
    onToggleForm:function () {
      this.setState({
          formDisplay:!this.state.formDisplay
      })  
    },
    onNewQuestion:function (newQuestion) {
        newQuestion.id=this.state.questions.length+1;
        newQuestions = this.state.questions.concat(newQuestion);
        // console.log(newQuestion);
        this.setState({
            questions:newQuestions
        });
    },
    onVote:function (key, newCount) {
        var questions = _.uniq(this.state.questions);
        var index = _.findIndex(questions,function (val) {
            return val.id===key;
        });
        questions[index].voteCount = newCount;
        questions =this.sortQuestion(questions);
        this.setState({
            questions:questions
        })
        
    },
    sortQuestion:function (questions) {
        questions.sort(function (a, b) {
            return  b.voteCount-a.voteCount;
        });
        return questions;
    },
    render: function () {
        return (
            <div>

                <div className="jumbotron text-center">
                    <div className="container">
                        <h1>React Q&A</h1>
                        <ShowAddButton onToggle={this.onToggleForm}/>
                    </div>
                </div>
                <div className="main container">
                    <QuestionForm onNewQuestion = {this.onNewQuestion} onToggle={this.onToggleForm} formDisplay={this.state.formDisplay}/>
                    <QuestionList questions={this.state.questions} onVote = {this.onVote}/>
                </div>

            </div>
        )
    }
})