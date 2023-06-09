import React, { useState, useRef, useEffect } from 'react';
import useInterval from './useInterval';

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

const RSP = () => {
    const [result, setResult] = useState('');
    const [imgCoord, setImgCoord] = useState(rspCoord.가위);
    const [score, setScore] = useState(0);
    const [clickable, setClickable] = useState(false);
    const [isRunning, setIsRunning] = useState(true);
    
    const changeHand = () => {
    if (imgCoord === rspCoord.바위) {
        setImgCoord(rspCoord.보);
    } else if (imgCoord === rspCoord.가위) {
        setImgCoord(rspCoord.바위);
    } else if (imgCoord === rspCoord.보) {
        setImgCoord(rspCoord.가위);
    }
        };

    useInterval(changeHand, isRunning ? 100 : null);
    
    const onClickBtn = (choice) => () => {
        if (clickable) return;
        setClickable(true);
        if (isRunning) {
            setIsRunning(false);
        }
        const myScore = scores[choice];
        const comScore = scores[computerChoice(imgCoord)];
        const diff = myScore - comScore;
        if (diff === 0) {
            setResult('비겼습니다');
            
        } else if ([-1, 2].includes(diff)) {
            setResult('이겼습니다');
            setScore(prev => prev + 1);
        } else {
            setResult('졌습니다');
            setScore(prev => prev - 1);
        }
        
        setTimeout(() => {
            setClickable(false);
            setIsRunning(true);
        }, 1200);
    }
     
   return (
      <>
        <div id="computer" style={{ background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0` }} />
        <div>
          <button id="scissor" className="btn" onClick={onClickBtn('가위')}>가위</button>
          <button id="rock" className="btn" onClick={onClickBtn('바위')}>바위</button>
          <button id="paper" className="btn" onClick={onClickBtn('보')}>보</button>
        </div>
        <div>{result}</div>
        <div>현재 {score}점</div>
      </>
    );
}

export default RSP;