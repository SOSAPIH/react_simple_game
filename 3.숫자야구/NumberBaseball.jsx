import React, { Component } from 'react';
import Try from './TryClass';

function getNumbers() { //숫자 4개를 겹치지 않고 뽑는 함수
    const candidate = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const array = [];
    [1, 2, 3, 4].forEach(() => {
        const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
        array.push(chosen);
    });
    return array;
}

class NumberBaseball extends Component{
    state = {
        result: '',
        value: '',
        answer: getNumbers(),
        tries: [],
    }
    onSubmitForm = e => {
        e.preventDefault();
        if (this.state.value === this.state.answer.join('')) {
            this.setState((prevState) => {
                return {
                    result: '홈런!',
                    tries: [...prevState.tries, { try: this.state.value, result: '홈런!' }],
                    value: '',
                }
            });
            alert('게임을 다시 시작합니다');
            this.inputRef.focus();
        } else {
            const answerArray = this.state.value.split('').map(v => parseInt(v));//입력한 inputValue를 4자리 숫자로 저장
            let strike = 0;
            let ball = 0;
            if (this.state.tries.length >= 9) {
                this.setState({
                    result: `실패! 정답은 ${this.state.answer.join('')}입니다.`
                });
                alert('게임을 다시 시작합니다!');
                this.setState({
                    value: '',
                    answer: getNumbers(),
                    tries: [],
                })
                this.inputRef.focus();
            } else { //기회가 남음
                for (let i = 0; i < 4; i++){
                    if (answerArray[i] === this.state.answer[i]) {
                        strike++;
                    } else if (this.state.answer.includes(answerArray[i])) {
                        ball++;
                    }
                }
                this.setState((prevState) => {
                    return {
                        tries: [...prevState.tries, { try: this.state.value, result: `${strike} 스트라이크 ${ball} 볼 입니다.` }],
                        value: '',
                    }
                })
                this.inputRef.focus();
            }
        }
    };

    onChangeInput = (e) => {
        this.setState({value: e.target.value});
    }
    inputRef;
    onInputRef = (c) => {
        console.log(c);
        this.inputRef = c;
    }
    render() {
        return (
            <>
                <h1>{this.state.result}</h1>        
                <form onSubmit={this.onSubmitForm}>
                    <input ref={this.onInputRef} maxLength={4} value={this.state.value} onChange={this.onChangeInput} />
                </form>
                <div>시도: {this.state.tries.length}</div>
                <ol>
                    {this.state.tries.map((v, i) => {
                        return <Try key={`${i+1}차 시도: `} tryInfo={v} />
                    })}
                </ol>
            </>  
        );
    }
}

// export const hello = 'Hello' // import {hello}
export default NumberBaseball; // import NumberBaseball => default는 한 번만 쓸 수 있음
