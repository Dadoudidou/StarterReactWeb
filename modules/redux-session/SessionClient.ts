
import * as Reducer from "./reducer"
import * as Redux from "redux"

type SessionClientOptions = {
    reduxRootSelector?: (state: any) => any,
    getStore: () => Redux.Store<any>
}

const defaultSessionClientOptions: Partial<SessionClientOptions> = {
    reduxRootSelector: state => state.session
}

export class SessionClient
{
    options: Partial<SessionClientOptions> = defaultSessionClientOptions;
    store: Redux.Store<any> = undefined;

    constructor(options: SessionClientOptions){
        this.options = {
            ...defaultSessionClientOptions,
            ...options
        };
    }

    reducer = () => {
        return Reducer.reducer;
    }

    set = (key: string, value: any) => {
        let _store = this.options.getStore();
        if(_store == undefined) throw new Error("[SESSION]: getStore return undefined");

        _store.dispatch(Reducer.Actions.set({
            key: key,
            value: value
        }));
    }

    clear = () => {
        let _store = this.options.getStore();
        if(_store == undefined) throw new Error("[SESSION]: getStore return undefined");

        _store.dispatch(Reducer.Actions.clear());
    }

    get = (key: string, defaultValue?: any): any => {
        let _store = this.options.getStore();
        if(_store == undefined) throw new Error("[SESSION]: getStore return undefined");
        if(!this.options.reduxRootSelector) throw new Error("[SESSION]: reduxRootSelector is not defined");
        let _SessionState = this.options.reduxRootSelector(_store.getState());
        if(!_SessionState) throw new Error("[SESSION]: reduxRootSelector return not defined state");

        let _value = _SessionState[key];
        if(_value == undefined) return defaultValue;
        return _value;
    }
    
}