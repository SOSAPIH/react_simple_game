import React, { Component } from 'react';

class ResponseCheck extends Component {
    state = {
        state: 'waiting',
        message: '클릭해서 시작하세요',
        result: 0,
        average: [],

    }
    onReset = () => {
        const {state, message, result, average } = this.state;
        
        this.setState({
            result: 0,
            average: [],
        })
    }
    
    timeout;
    startTime;
    endTime;
    onClickScreen = () => {
        const {state} = this.state;
        if (state === 'waiting') {
            this.setState({
                state: 'ready',
                message: '초록색이 되면 클릭!',
            });
            this.timeout = setTimeout(() => {
                this.setState({
                    state: 'now',
                    message: '클릭!',
                });
                this.startTime = new Date();
            }, Math.floor(Math.random() * 2500) + 1000);
        } else if (state === 'ready') {//대기 중
            clearTimeout(this.timeout);
            this.setState({
                state: 'waiting',
                message: '너무 빨랐어요! 다시 시작하세요'
            });
        } else if (state === 'now') {// 클릭
            this.endTime = new Date();
            this.setState(prev => {
                return {
                    state: 'waiting',
                    message: '클릭해서 시작하세요',
                    result: this.endTime - this.startTime,
                    average: [...prev.average, this.endTime - this.startTime]
                }
            });
        }
    };
    renderAverage = () => {
        const { average } = this.state;
        return (
            average.length === 0 ?
                null :
                <>
                <div>평균시간 {average.reduce((a, c) => a + c) / average.length}ms</div>
                <button onClick={this.onReset}>리셋</button>
                </>
        )
    };

    render() {
        const {state, message, result, average} = this.state;
        return (
            <>
                <div id="screen" className={state} onClick={this.onClickScreen}>
                    {message}
                </div>
                <div>반응시간 {result}ms</div>
                {this.renderAverage()}
            </>
        )
    }    
}

export default ResponseCheck;