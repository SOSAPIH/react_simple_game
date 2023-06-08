const React = require('react');
const { Component } = React;  //1,2 줄은 pkg나 library를 가져오는 것

class WordRelay extends Component {
    state = {
        word: '단어',
        value: '',
        result: '',
    };
    onSubmitForm = (e) => {
        e.preventDefault();
        if (this.state.word[this.state.word.length - 1] === this.state.value[0]) {
            this.setState({
                word: this.state.value,
                value: '',
                result: '통과!',
            })
            this.input.focus();
        } else {
            this.setState({
                value: '',
                result: '땡!',
            })
            this.input.focus();
        }
    };
    onChangeInput = (e) => {
        this.setState({ value: e.target.value });
    };
    input;
    onRefInput = (c) => {
        this.input = c;
    };
    render() {
        return (<>
            <div>{this.state.word}</div>
            <form onSubmit={this.onSubmitForm}>
                <input ref={this.onRefInput} value={this.state.value} onChange={this.onChangeInput} />
                <button>버튼!</button>
            </form>
            <div>{this.state.result}</div>
        </>);
    }
}

module.exports = WordRelay; // 해당 Component를 바깥에서도 쓸 수 있도록