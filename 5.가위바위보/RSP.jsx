import React, { Component } from 'react';
// 클래스의 경우: constructor => render => ref => componentDidMount() => (setState or props 바뀔 때) => shouldComponentUpdate(true) => render => componentDidUpdate() => ...
//부모 컴포넌트가 자식을 제거할 때: componentWillUnmount() =>  소멸  \\ 제거하지 않는다면 포함되지 않는 과정

const rspCoord = {
    바위: '0',
    가위: '-142px',
    보: '-284px',
}
const scores = {
    가위: 1,
    바위: 0,
    보: -1,
}

const computerChoice = (imgCoord) => {
    return Object.entries(rspCoord).find( v => v[1] === imgCoord)[0]
} // return 가위 바위 보

class RSP extends Component {
    state = {
        result: '',
        imgCoord: rspCoord.가위, // '-142px'
        score: 0,
    };
    interval;
    clickable = false;
    
    changeHand = () => {
    const {imgCoord} = this.state;
    if (imgCoord === rspCoord.바위) {
      this.setState({
        imgCoord: rspCoord.가위,
      });
    } else if (imgCoord === rspCoord.가위) {
      this.setState({
        imgCoord: rspCoord.보,
      });
    } else if (imgCoord === rspCoord.보) {
      this.setState({
        imgCoord: rspCoord.바위,
      });
    }
  };
    
    componentDidMount() {// 컴포넌트 첫 렌더링 후 실행 => 주로 비동기 요청
        this.interval = setInterval(this.changeHand, 100);
    }
    componentDidUpdate() {// 리렌더링 후
        
    }
    componentWillUnmount() {// 컴포넌트가 제거되기 직전 => 비동기 요청 정리
        clearInterval(this.interval);   
    }
    
    
    onClickBtn = choice => () => { //이벤트 핸들러의 메서드 이기 때문에 함수를 return해야함
        if (this.clickable) return;
        this.clickable = true;
        const { imgCoord } = this.state;
        clearInterval(this.interval);
        const myScore = scores[choice];
        const comScore = scores[computerChoice(imgCoord)];
        const diff = myScore - comScore;
        if (diff === 0) {
            this.setState({
                result: '비겼습니다'
            });
        } else if ([-1, 2].includes(diff)) {
            this.setState((prev) => {
                return {
                    result: '이겼습니다',
                    score: prev.score + 1,
                }
            })
        } else {
            this.setState((prev) => {
                return {
                    result: '졌습니다',
                    score: prev.score - 1,
                }
            })
        }
        
        setTimeout(() => {
            this.clickable = false;
            this.interval = setInterval(this.changeHand, 100);  
        }, 1200);
    }
    
    render() {
        const { result, score, imgCoord } = this.state;
        return (
      <>
        <div id="computer" style={{ background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0` }} />
        <div>
          <button id="rock" className="btn" onClick={this.onClickBtn('바위')}>바위</button>
          <button id="scissor" className="btn" onClick={this.onClickBtn('가위')}>가위</button>
          <button id="paper" className="btn" onClick={this.onClickBtn('보')}>보</button>
        </div>
        <div>{result}</div>
        <div>현재 {score}점</div>
      </>
    ); 
    }

}

export default RSP;