import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Ball from './Ball'; 

function getWinNumbers() {
    console.log('getWinNumbers');
    const candidate = Array(45).fill().map((v, i) => i + 1);
    const shuffle = [];
    while (candidate.length > 0) {
        shuffle.push(candidate.splice(Math.floor(Math.random()*candidate.length),1)[0])
    }
    const bonusNumber = shuffle[shuffle.length - 1];
    const winNumbers = shuffle.slice(0, 6).sort((a, b) => a - b);//오름차순 정렬
    return [...winNumbers, bonusNumber];
}

const Lotto = () => {
    const [winBalls, setWinBalls] = useState([]);
    const lottoNumber = useMemo(() => getWinNumbers(), [winBalls]);
    const [winNumbers, setWinNumbers] = useState(lottoNumber);
    const [bonus, setBonus] = useState(null);
    const [redo, setRedo] = useState(false);
    const timeouts = useRef([]);

    useEffect(() => {
        for (let i = 0; i < winNumbers.length - 1; i++){
            timeouts.current[i] = setTimeout(() => {
                setWinBalls((prevBalls) => [...prevBalls, winNumbers[i]]);
            }, (i + 1) * 1000);
        }
        timeouts.current[6] = setTimeout(() => {
            setBonus(winNumbers[6]);
            setRedo(true);
        }, 7000);

        return () => { // return: ComponentWillUnmount가 됨
            timeouts.current.forEach((v) => { clearTimeout(v) });
        }
    }, [timeouts.current])  //빈배열: ComponentDidMount
                            //배열요소: ComponentDidMount + ComponentDidUpdate 둘 다
    
    const onClickRedo = useCallback(() => {//다시하기
        setWinNumbers(getWinNumbers());
        setWinBalls([]);
        setBonus(null);
        setRedo(false);
        timeouts.current = [];
    }, [winNumbers])//바뀌었을 때 재실행 or 재저장이 발생하도록
    
        return (<>
            <div>당첨 숫자</div>
            <div id='결과창'>{winBalls.map(v => <Ball key={v} number={v} />)}</div>
            <div>보너스</div>
            {bonus && <Ball number={bonus} />}
            {redo && <button onClick={onClickRedo}>다시!</button>}
        </>) 
}

export default Lotto;