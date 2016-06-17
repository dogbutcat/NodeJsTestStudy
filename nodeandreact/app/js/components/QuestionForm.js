/**
 * Created by oliver on 6/15/16.
 */
var React = require('react');

module.exports = React.createClass({
    handleForm:function (e) {
        // e.preventDefault();
        // console.log(e.nativeEvent);
        e.preventDefault();
        if (!this.refs.title.value||!this.refs.description.value) return
        var newQuestion = {
            title:this.refs.title.value,
            description:this.refs.description.value,
            voteCount:0,
        };
        this.refs.newForm.reset();
        this.props.onNewQuestion(newQuestion);
    },
    render:function () {
        var styleObj = {
            display:this.props.formDisplay?'block':'none'
        }
        return (
            <form ref='newForm' style={styleObj} name="addQuestion" className="clearfix" onSubmit={this.handleForm}>
                <div className="form-group">
                    <label htmlFor="qtitle">Question</label>
                    <input ref="title" type="text" id="qtitle" className="form-control"
                           placeholder="Please input your question"/>
                </div>
                <textarea ref="description" rows="3" className="form-control" placeholder="Question Detail"></textarea>
                <button className="btn btn-success pull-right">Confirm</button>
                <button onClick={this.props.onToggle} className="btn btn-default pull-right">Cancel</button>
            </form>
        )
    }
});