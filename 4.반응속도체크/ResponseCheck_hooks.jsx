import React from 'react';
import { useState } from React;

const ResponseCheck = () => {
    const [state, setState] = useState('waiting');
    const [message, setMessage] = useState('클릭하여 시작하세요');
    const [result, setResult] = useState(0);
    const [average, setAverage] = useState([]);
    const timeout = useRef(null);
    const startTime = useRef();
    const endTime = useRef();
    
    const onClickScreen = () => {
        if (state === 'waiting') {
            setState('ready');
            setMessage('초록색이 되면 클릭!');
            timeout.current = setTimeout(() => {
                setState('now');
                setMessage('클릭!!');
                startTime.current = new Date();
            }, Math.floor(Math.random() * 2500) + 1000);
        } else if (state === 'ready') {//대기 중
            clearTimeout(timeout.current);
            setState('waiting');
            setMessage('너무 빨랐어요! 다시 시작하세요');
        } else if (state === 'now') {// 클릭
            endTime.current = new Date();
            setState('waiting');
            setMessage('클릭해서 시작하세요');
            setResult(endTime.current - startTime.current);
            setAverage(prev =>
                [...prev.average, endTime.current - startTime.current]
            );
            
        }
    };
    const onReset = () => {
        setResult(0);
        setAverage([]);
    };
    const renderAverage = () => {
        return average.length === 0 ?
            null :
            <>
            <div>평균시간 {average.reduce((a, c) => a + c) / average.length}ms</div>
            <button onClick={onReset}>리셋</button>
            </>
    };

    return (
            <>
                <div id="screen" className={state} onClick={onClickScreen}>
                    {message}
                </div>
                <div>반응시간 {result}ms</div>
                {renderAverage()}
            </>
        )
}

export default ResponseCheck;