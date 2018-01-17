import { StoreManager } from "modules/redux-store-manager"

// -- session
import { SessionClient } from "modules/redux-session"
let _session: SessionClient = new SessionClient({
    getStore: () => _defaultStore,
    reduxRootSelector: state => state.session
})

// -- middlewares

// -- storeManager
let _storeManager = new StoreManager();
let _defaultStore = _storeManager.createStore(
    "default",
    {
        session: _session.reducer()
    },
    {

    },
    [

    ]
).getStore("default");

export const getStore = () => _defaultStore;
export const getStoreManager = () => _storeManager;
export const getSession = () => _session;