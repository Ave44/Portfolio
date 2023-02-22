import types from "./types";

export const addOneConnection = (payload) => ({
    type: types.ADD_CONNECTION,
    payload
});

export const addMultipleConnections = (payload) => ({
    type: types.ADD_MULTIPLE_CONNECTIONS,
    payload
});

export const deleteConnection = (payload) => ({
    type: types.DELETE_CONNECTION,
    payload
});
