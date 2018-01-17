import * as Redux from "redux";

export interface IStore<T> extends Redux.Store<T> {
    asyncReducers: { [name: string]: Redux.Reducer<any> }
    injectAsyncReducer: (key:string, reducer: Redux.Reducer<any>) => void
}

export class StoreManager {

    private stores: { [key:string]: IStore<any> }
    private rootReducer:{ [key: string]: Redux.Reducer<any> }

    constructor(){
        this.stores = {};
        this.rootReducer = {
            lastAction: (state = null, action) => { return action; }
        };
    }

    addStore(key: string, store: IStore<any>): StoreManager {
        this.stores[key.toLowerCase()] = store;
        return this;
    }

    getStore(key: string): IStore<any> {
        return this.stores[key.toLowerCase()];
    }

    createStore(key: string, reducers:{ [key: string]: Redux.Reducer<any> } = {}, initialState = {}, middlewares: Redux.Middleware[] = []): StoreManager {
        let __this = this;

        // *** middlewares

        // *** store
        let _store = Redux.createStore(
            Redux.combineReducers({ 
                ...this.rootReducer,
                ...reducers
            }),
            initialState,
            Redux.applyMiddleware(...middlewares)
        ) as IStore<any>

        // *** reducers asynchrones
        _store.asyncReducers = {
            ...reducers
        };
        _store.injectAsyncReducer = (reducerKey:string, reducer: Redux.Reducer<any>) => {
            __this.injectAsyncReducer(key, reducerKey, reducer);
        }

        // *** add to store manager
        this.addStore(key, _store);

        return this;
    }

    injectAsyncReducer(key: string, name: string, asyncReducer): StoreManager {
        let __store = this.getStore(key);
        if(!__store){
            console.error("not found store with key [" + key + "]");
            return this;
        }

        __store.asyncReducers[name] = asyncReducer;
        __store.replaceReducer(Redux.combineReducers({
            ...this.rootReducer,
            ...__store.asyncReducers
        }));
        return this;
    }
}

