import React, { Component } from 'react';
import Ball from './Ball';

function getWinNumbers() {
    console.log('getWinNumbers');
    const candidate = Array(45).fill().map((v, i) => i + 1);
    const shuffle = [];
    while (candidate.length > 0) {
        shuffle.push(candidate.splice(Math.floor(Math.random()*candidate.length),1)[0])
    }
    const bonusNumber = shuffle[shuffle.length - 1];
    const winNumbers = shuffle.slice(0, 6).sort((a, b) => a - b);
    return [...winNumbers, bonusNumber];
}

class Lotto extends Component {
    state = {
        winNumbers: getWinNumbers(),
        winBalls: [],
        bonus: null,
        redo: false, // 재실행을 위함
    }
    timeouts = [];

    runTimeouts = () => {
        for (let i = 0; i < this.state.winNumbers.length - 1; i++) {
            this.timeouts[i] = setTimeout(() => {
                this.setState((prev) => {
                    return {
                        winBalls: [...prev.winBalls, this.state.winNumbers[i]]
                    }
                })
            }, (i+1) * 1000);
        }
        this.timeouts[6] = setTimeout(() => {
            this.setState({
                bonus: this.state.winNumbers[6],
                redo: true,
            })
        }, 7000);
    }
    
    componentDidMount() {
        console.log('didMount');
        this.runTimeouts();
    }

    
    componentDidUpdate() {
        console.log("didUpdate");
        if (this.state.winBalls.length === 0) {
            this.runTimeouts();
        }
    }
    
    componentWillUnmount() {
        this.timeouts.forEach((i) => {
            clearTimeout(i);
        })
    }
    onClickRedo = () => {//다시하기
        this.setState({
            winNumbers: getWinNumbers(),
            winBalls: [],
            bonus: null,
            redo: false,
        });
        this.timeouts = [];
    }
    
    render() {
        const { winBalls, bonus, redo } = this.state;

        return (<>
            <div>당첨 숫자</div>
            <div id='결과창'>{winBalls.map(v => <Ball key={v} number={v} />)}</div>
            <div>보너스</div>
            {bonus && <Ball number={bonus} />}
            {redo && <button onClick={this.onClickRedo}>다시!</button>}
        </>) 
    }
}

export default Lotto;