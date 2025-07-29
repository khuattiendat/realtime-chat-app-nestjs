import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    user: {
        id: null,
        username: '',
        email: '',
        isOnline: false,
        lastSeen: null,
    },
    userOnLines: [],
    socketConnection: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setUserOnLines: (state, action) => {
            state.userOnLines = action.payload;
        },
        setSocketConnection: (state, action) => {
            state.socketConnection = action.payload;
        },
    },
});

export const {setUser, setUserOnLines, setSocketConnection} = userSlice.actions;
export default userSlice.reducer;
