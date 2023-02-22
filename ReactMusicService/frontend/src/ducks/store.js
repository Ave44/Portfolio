import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger'
import songsReducer from './songs/reducer';
import musiciansReducer from './musicians/reducer';
import connectionsReducer from './connections/reducer';
import languagesReducer from './languages/reducer'

const Reducer = combineReducers({songsReducer, musiciansReducer, connectionsReducer, languagesReducer})

const store = createStore(Reducer, applyMiddleware(logger, thunk))

export default store;