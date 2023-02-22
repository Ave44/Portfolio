import types from "./types";
import storeInit from "../storeInitData.json"

const connectionsReducer = (state = { connections: storeInit.connections }, action) => {
    switch(action.type) {
        case types.ADD_CONNECTION:
            return {...state, connections: [...state.connections, action.payload]};
        case types.ADD_MULTIPLE_CONNECTIONS:
            return {...state, connections: [...state.connections, ...action.payload]};
        case types.DELETE_CONNECTION:
            return {...state, connections: state.connections.filter(connection => {return connection.id === action.payload ? 0 : 1})};
        default:
            return state
    }
}

export default connectionsReducer;