import types from "./types";

export const addOneMusician = (payload) => ({
    type: types.ADD_MUSICIAN,
    payload
});

export const addMultipleMusicians = (payload) => ({
    type: types.ADD_MULTIPLE_MUSICIANS,
    payload
});

export const deleteMusician = (payload) => ({
    type: types.DELETE_MUSICIAN,
    payload
});

export const editTheMusician = (payload) => ({
    type: types.EDIT_MUSICIAN,
    payload
});

export const setMusiciansSorting = (payload) => ({
    type: types.SET_MUSICIANS_SORTING,
    payload
});