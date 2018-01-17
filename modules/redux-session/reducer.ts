import { IAction, isType, actionCreator } from "modules/redux-actions";

// ----------- ACTIONS
interface IAction_Set { key: string, value: any };
const actionType = "services/session/"
export const Actions = {
    set: actionCreator<IAction_Set>(actionType + "set"),
    clear: actionCreator(actionType + "clear")
}

// ----------- STATE
export interface ISessionState {
    [key: string]: any
}
export const initialState: ISessionState = {}

// ----------- REDUCER
export const reducer = (state: ISessionState = initialState, action: IAction<any>): ISessionState => {

    if(isType(action, Actions.set)){
        return {
            ...state,
            [action.payload.key]: action.payload.value
        }
    }

    if(isType(action, Actions.clear)){
        return initialState;
    }

    return state;
}