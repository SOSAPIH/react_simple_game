//customHook
import { useRef, useEffect } from 'react';

function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, []);
    
    useEffect(() => {
        savedCallback.current();
        // function tick() {
        // }

    if (delay !== null) {
        let id = setInterval(savedCallback.current, delay);
        return () => clearInterval(id);
        }
    }, [delay]);

    return savedCallback.current;
}

// ----------------------------------------------------------------
function $useInterval(callback, delay) {
    useEffect(() => {
        if (delay !== null) {
            let id = setInterval(callback, delay);
            return () => clearInterval(id);
        }
    }, [delay, callback]);
    return callback;
}

export default $useInterval;
