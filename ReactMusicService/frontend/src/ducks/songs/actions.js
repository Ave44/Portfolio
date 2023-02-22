import types from "./types";

export const addOneSong = (payload) => ({
    type: types.ADD_SONG,
    payload
});

export const addMultipleSongs = (payload) => ({
    type: types.ADD_MULTIPLE_SONGS,
    payload
});

export const deleteSong = (payload) => ({
    type: types.DELETE_SONG,
    payload
});

export const editTheSong = (payload) => ({
    type: types.EDIT_SONG,
    payload
});

export const setSorting = (payload) => ({
    type: types.SET_SORTING,
    payload
});