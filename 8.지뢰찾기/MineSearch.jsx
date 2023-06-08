import React, {useReducer, createContext, useMemo, useEffect} from 'react';
import Table from './Table';
import Form from './Form';

export const TableContext = createContext({
    tableData: [],
    dispatch: ()=>{},
});

export const CODE = {
    NORMAL: -1,
    QUESTION: -2,
    FLAG: -3,
    MINE: -7,
    QUESTION_MINE: -4,
    FLAG_MINE: -5,
    CLICKED_MINE: -6,
    OPENED: 0,
}

const initialState = {
    tableData: [],
    timer: 0,
    result: '',
    halted: false,
    initialCount: 0,
    data: {
        row: 0,
        cell: 0,
        mine: 0,
    },
}

const plantMine = (row, cell, mine) => {
    console.log(row, cell, mine);
    const candidate = Array(row * cell).fill().map((v, i) => i);
    const shuffle = [];
    while (candidate.length > row * cell - mine) {
        const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
        shuffle.push(chosen);
    }
    const data = [];
    for (let i = 0; i < row; i++){
        const rowData = [];
        data.push(rowData);
        for (let j = 0; j < cell; j++) {
            rowData.push(CODE.NORMAL);
        }
    }
    for (let k = 0; k < mine; k++){
        const ver = Math.floor(shuffle[k] / cell);
        const hor = shuffle[k] % cell;
        data[ver][hor] = CODE.MINE;
    }
    return data;
}

export const START_GAME = 'START_GAME';
export const OPEN_CELL = 'OPEN_CELL';
export const CLICK_MINE = 'CLICK_MINE';
export const NORMALIZE_CELL = 'NORMALIZE_CELL';
export const FLAG_CELL = 'FLAG_CELL';
export const QUESTION_CELL = 'QUESTION_CELL';
export const INCREMENT_TIMER = 'INCREMENT_TIMER';
const reducer = (state, action) => {
    switch (action.type) {
        case START_GAME:
            return {
                ...state,
                data: {row: action.row, cell: action.cell, mine: action.mine},
                tableData: plantMine(action.row, action.cell, action.mine),
                halted: false,
                initialCount: 0,
                timer: 0,
            };
        case OPEN_CELL: {
            const tableData = [...state.tableData];
            tableData.forEach((row, i) => {
                tableData[i] = [...state.tableData[i]];
            });
            const checked = [];
            let openCount = 0;
            const checkAround = (row, cell) => {
                if([CODE.OPENED, CODE.FLAG_MINE, CODE.FLAG, CODE.QUESTION, CODE.QUESTION_MINE].includes(tableData[row][cell])) return; //닫힌 칸이 아닌 칸은 열지않게
                if(row < 0 || row >= tableData.length || cell < 0 || cell >= tableData[0].length) return; //상하좌우 중 없는 칸 안 열기
                if (checked.includes(row + ',' + cell)) {// 이미 연 칸은 무시
                    return
                } else {
                    checked.push(row + ',' + cell);
                }
                if (tableData[row][cell] === CODE.NORMAL) {
                    openCount += 1;
                }
                let around = [];
                if (tableData[row-1]) {
                    around = around.concat(
                        tableData[row - 1][cell - 1],
                        tableData[row - 1][cell],
                        tableData[row - 1][cell + 1],
                    )
                }
                around = around.concat(
                    tableData[row][cell - 1],
                    tableData[row][cell + 1],
                )
                if (tableData[row + 1]) {
                    around = around.concat(
                        tableData[row + 1][cell - 1],
                        tableData[row + 1][cell],
                        tableData[row + 1][cell + 1],
                    )
                }
                const count = around.filter((v) => [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v)).length;
                tableData[row][cell] = count;
                if (count === 0) {// 해당 칸이 0 이면
                    const near = [];
                    if (row - 1 > -1) {
                        near.push([row - 1, cell - 1]);
                        near.push([row - 1, cell ]);
                        near.push([row - 1, cell + 1]);
                    }
                    near.push([row, cell - 1]);
                    near.push([row, cell + 1]);
                    if (row + 1 < tableData.length) {
                        near.push([row + 1, cell - 1]);
                        near.push([row + 1, cell]);
                        near.push([row + 1, cell + 1]);
                    }
                    near.forEach((v) => {
                        if (tableData[v[0][v[1]]] !== CODE.OPENED) { // 주변칸이 이미 연 칸이 아니면 주변체크
                            checkAround(v[0], v[1]);
                        }
                    })
                } else {
                    
                }
            }
            checkAround(action.row, action.cell);
            let halted = false; 
            let result = ''; 
            if (state.data.row * state.data.cell - state.data.mine === state.initialCount + openCount) {//승리
                halted = true;
                result = 'GAME WIN';
            }
            return {
                ...state,
                tableData,
                initialCount: state.initialCount + openCount,
                halted,
                result,
            };
        } 
        case CLICK_MINE:{
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            tableData[action.row][action.cell] = CODE.CLICKED_MINE;
            return {
                ...state,
                tableData,
                halted: true,
            };
        }
        case FLAG_CELL: {
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            if (tableData[action.row][action.cell] === CODE.MINE) {
                tableData[action.row][action.cell] = CODE.FLAG_MINE;
            } else {
                tableData[action.row][action.cell] = CODE.FLAG;
            }
            return {
                ...state,
                tableData,
            };
        }
        case QUESTION_CELL: {
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            if (tableData[action.row][action.cell] === CODE.FLAG_MINE) {
                tableData[action.row][action.cell] = CODE.QUESTION_MINE;
            } else {
                tableData[action.row][action.cell] = CODE.QUESTION;
            }
            return {
                ...state,
                tableData,
            };
        }
        case NORMALIZE_CELL: {
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            if (tableData[action.row][action.cell] === CODE.QUESTION_MINE) {
                tableData[action.row][action.cell] = CODE.MINE;
            } else {
                tableData[action.row][action.cell] = CODE.NORMAL;
            } 
            return {
                ...state,
                tableData,
            };
        }
        case INCREMENT_TIMER: {
            return {
                ...state,
                timer: state.timer + 1,
            }
        }
        default:
            return state;
    }
}

const MineSearch = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { tableData, halted, timer, result } = state;
    const value = useMemo(() => ({tableData: tableData, halted: halted, dispatch}), [tableData, halted]);

    useEffect(() => {
        let timer;
        if (halted === false) {
            timer = setInterval(() => {
                dispatch({type: INCREMENT_TIMER })
            }, 1000);
        }
        
        return () => {
            clearInterval(timer);
        }
    }, [halted])
    
    return (<TableContext.Provider value={value}>
        <Form />
        <div>{timer}</div>
        <Table/>
        <div>{result}</div>
    </TableContext.Provider>)
}

export default MineSearch;