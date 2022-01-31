import { ACTIONS } from './UIDesign';

export default function OperationButton({ className, dispatch, operation }) {
    return (
        <button className={className} onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })}>
            {operation}
        </button>
    )
}