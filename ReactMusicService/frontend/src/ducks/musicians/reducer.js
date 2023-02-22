import types from "./types";
import storeInit from "../storeInitData.json"

const musiciansReducer = (state = { musicians: storeInit.musicians, sorting: "A" }, action) => {
    switch(action.type) {
        case types.ADD_MUSICIAN:
            return {...state, musicians: [...state.musicians, action.payload]};
        case types.ADD_MULTIPLE_MUSICIANS:
            return {...state, musicians: [...state.musicians, ...action.payload]};
        case types.DELETE_MUSICIAN:
            return {...state, musicians: state.musicians.filter(musician => {return musician.id === action.payload ? 0 : 1})};
        case types.EDIT_MUSICIAN:
            return {...state, musicians: state.musicians.map(musician => {return musician.id === action.payload.id ? action.payload : musician})};
        case types.SET_MUSICIANS_SORTING:
            return {...state, sorting: action.payload}
        default:
            return state
    }
}

export default musiciansReducer;