import { ACTIONS } from './UIDesign';

export default function DigitButton({ className, dispatch, digit }) {
    return (
        <button className={className} onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}>
            {digit}
        </button>
    )
}