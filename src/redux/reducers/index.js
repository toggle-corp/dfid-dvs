import { persistCombineReducers } from 'redux-persist';
import storeConfig from '../../config/store';

const initialDummyState = {};
const dummyReducer = (state = initialDummyState) => state;

const reducers = {
    dummyReducer,
};

const appReducer = persistCombineReducers(storeConfig, reducers);
export default appReducer;
