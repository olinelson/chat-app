const users = []

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return { error: 'Username and room are required' }
    }

    const existingUser = users.find(user => {
        return user.room === room && user.username === username
    })

    if (existingUser) {
        return { error: 'Username is in use' }
    }

    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex(u => u.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    const user = users.find(u => u.id === id)
    return user
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    const foundUsers = users.filter(u => u.room === room)
    return foundUsers
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}