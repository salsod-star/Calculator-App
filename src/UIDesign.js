import React, { useReducer } from 'react';
import OperationButton from './operationButton';
import DigitButton from './DigitButton';
import './UIDesign.css';


export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    CHOOSE_OPERATION: 'choose-operation',
    CLEAR: 'clear',
    DELETE_DIGIT: 'delete-digit',
    EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}) {
    switch (type) {
        case ACTIONS.ADD_DIGIT:
            if (state.currentOperand == null && payload.digit === '.') {
                return {
                    ...state,
                    currentOperand: `0${payload.digit}`
                }
            }
            if (state.overwrite) {
                return {
                    ...state,
                    currentOperand: payload.digit,
                    overwrite: false
                }
            }
            if(payload.digit === '0' && state.currentOperand === '0') return state
            if(payload.digit === '.' && state.currentOperand.includes('.')) return state
            return {
                ...state,
                currentOperand: `${state.currentOperand || ''}${payload.digit}`
            }
        case ACTIONS.CLEAR:
            return {}
        case ACTIONS.CHOOSE_OPERATION:
            if (state.currentOperand == null && state.prevOperand == null && payload.operation === '√') {
                console.log(payload.operation)
                return {
                    ...state,
                    currentOperand: `${payload.operation}`
                }
            }
            if (state.currentOperand == null && state.prevOperand == null) return state
            
            if (state.currentOperand == null) {
                return {
                    ...state,
                    operation: payload.operation
                }
            }

            if (state.prevOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,
                    prevOperand: state.currentOperand,
                    currentOperand: null
                }
            }

            return {
                ...state,
                prevOperand: evaluate(state),
                operation: payload.operation,
                currentOperand: null
            }
        case ACTIONS.EVALUATE:
            if (state.operation == null || state.currentOperand == null || state.prevOperand == null) {
                return state;
            }
            return {
                ...state,
                prevOperand: null,
                currentOperand: evaluate(state),
                operation: null,
                overwrite: true
            }
        case ACTIONS.DELETE_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    overwrite: false,
                    currentOperand: null
                }
            }
            if(state.currentOperand == null) return state
            if (state.currentOperand.length === 1) {
                return {...state, currentOperand: null}
            }
            return {
                ...state,
                currentOperand: state.currentOperand.slice(0, -1)
            }
        default:
            return state
    }
}

function evaluate({currentOperand, prevOperand, operation}) {
    const prev = parseFloat(prevOperand)
    const curr = parseFloat(currentOperand);

    if (isNaN(prev) || isNaN(curr)) return "";
    let computation = '';
    switch (operation) {
        case '+':
            computation = prev + curr;
            break;
        case '%':
            computation = prev % curr;
            break;
        case '^':
            computation = Math.pow(prev, curr);
            break;
        case '√':
            computation = Math.sqrt(prev);
            break;
        case '/':
            computation = prev / curr;
            break;
        case '-':
            computation = prev - curr;
            break;
        case 'x':
            computation = prev * curr;
            break;
        default:
            break;
    }
    return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', { maximumFractionDigits: 0 })

function formatOperand(operand) {
    if (operand === '√') return '√'
    if (operand == null) return;
    const [integer, decimal] = operand.split('.');
    console.log(integer)
    if (decimal == null) return INTEGER_FORMATTER.format(integer);
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function UIDesign() {
    const [{ currentOperand, prevOperand, operation }, dispatch] = useReducer(reducer, {});
    
    return (
        <div className="container calculator">
            <div className="calculator__output">
                <div className="calculator__output--preview">{formatOperand(prevOperand)} {operation}</div>
                <div className="calculator__output--current">{formatOperand(currentOperand)}</div>
            </div>
            
            <div>
                <div className="btn-container flex">
                    <button className='btn btn-blue stretch' onClick={() => dispatch({ type: ACTIONS.CLEAR})}>AC</button>
                    <OperationButton className='btn btn-blue' operation='%' dispatch={dispatch}/>
                    <OperationButton className='btn btn-blue' operation='^' dispatch={dispatch}/>
                </div>

                <div className="btn-container flex">
                    <button className='btn red' onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT})}>DEL</button>
                    <OperationButton className='btn btn-blue' operation='√' dispatch={dispatch}/>
                    <OperationButton className='btn btn-blue' operation='/' dispatch={dispatch}/>
                </div>

                <div className="btn-container flex">
                    <DigitButton className='btn' digit='7' dispatch={dispatch}/>
                    <DigitButton className='btn' digit='8' dispatch={dispatch}/>
                    <DigitButton className='btn' digit='9' dispatch={dispatch}/>
                    <OperationButton className='btn btn-blue' operation='x' dispatch={dispatch}/>
                </div>

                <div className="btn-container flex">
                    <DigitButton className='btn' digit='4' dispatch={dispatch}/>
                    <DigitButton className='btn' digit='5' dispatch={dispatch}/>
                    <DigitButton className='btn' digit='6' dispatch={dispatch}/>
                    <OperationButton className='btn btn-blue' operation='-' dispatch={dispatch}/>
                </div>

                <div className="btn-container flex">
                    <DigitButton className='btn' digit='1' dispatch={dispatch}/>
                    <DigitButton className='btn' digit='2' dispatch={dispatch}/>
                    <DigitButton className='btn' digit='3' dispatch={dispatch}/>
                    <OperationButton className='btn btn-blue' operation='+' dispatch={dispatch}/>
                </div>

                <div className="btn-container flex">
                    <DigitButton className='btn' digit='.' dispatch={dispatch}/>
                    <DigitButton className='btn' digit='0' dispatch={dispatch}/>
                    <button className='btn btn-blue stretch' onClick={() => dispatch({ type: ACTIONS.EVALUATE})}>=</button>
                </div>
            </div>
        </div>
    )
}




export default UIDesign