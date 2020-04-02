const initialState = {
    accessToken: null,
    hasAccessToken: false
}

const reducer = (state = initialState, action) => {
    let newState = {...state}
    if (action.type === 'ASSIGN') {
        newState.accessToken=action.val
        newState.hasAccessToken = true
        return newState;
    }
    else if (action.type === 'GOT_TOKEN') {
        newState.hasAccessToken=true
        return newState;
    }
    return newState;
};

export default reducer;