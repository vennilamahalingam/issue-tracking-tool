
export const updateUser = (data) => {
    return { 
        type: 'update',
        payload: data
    }
}

export const readUser = () => {
    return { 
        type: 'read'
    }
}