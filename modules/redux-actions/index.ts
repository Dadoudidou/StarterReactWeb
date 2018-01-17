import * as assign from "object-assign";

export interface IAction<T> {
    type: string,
    action_id: string,
    payload: T,
    metas: IActionCreatorSettings
}

export interface IActionCreator<T> {
    type: string,
    action_id: string,
    (payload?: T): IAction<T>
}

export interface IActionAsyncCreator<T> {
    type: string,
    (payload?: T): (dispatch) => void
}

export interface IActionCreatorSettings {
    delay?: number
    [key: string]: any
}

export const actionCreator = <T>(action_id: string, type: string = "basic", settings?: IActionCreatorSettings): IActionCreator<T> => {
    
    let _function = (payload?: T): IAction<T> => {
        let _retour = {
            type: type,
            action_id: action_id,
            payload: payload,
            metas: {
                ...settings
            }
        }
        if (settings) {
            if (settings.delay != undefined) _retour.metas["delay"] = settings.delay;
        }
        return _retour;
    };
    
    return assign(
        _function,
        { type, action_id }
    )
}

export const actionAsyncCreator = <T>(type: string, action: (dispatch: Function, event: T) => any): IActionAsyncCreator<T> => {
    
    let _function = (payload?: T): ((dispatch) => void) => {
        /*let _retour = {
            type: type,
            payload: payload
        }*/

        return (dispatch) => {
            return action(dispatch, payload);
        };
    };

    return assign(
        _function,
        { type }
    );
}

export const isType = <T>(action: IAction<any>, actionCreator: IActionCreator<T>):
action is IAction<T> => action.type === actionCreator.type && action.action_id === actionCreator.action_id