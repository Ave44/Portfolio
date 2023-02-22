import types from "./types";
import storeInit from "../storeInitData.json"

const songsReducer = (state = { songs: storeInit.songs, sorting: "A" }, action) => {
    switch(action.type) {
        case types.ADD_SONG:
            return {...state, songs: [...state.songs, action.payload]};
        case types.ADD_MULTIPLE_SONGS:
            return {...state, songs: [...state.songs, ...action.payload]};
        case types.DELETE_SONG:
            return {...state, songs: state.songs.filter(song => {return song.id === action.payload ? 0 : 1})};
        case types.EDIT_SONG:
            return {...state, songs: state.songs.map(song => {return song.id === action.payload.id ? action.payload : song})};
        case types.SET_SORTING:
            return {...state, sorting: action.payload}
        default:
            return state
    }
}

export default songsReducer;