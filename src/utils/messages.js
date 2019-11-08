const generateMessage = (text, username) => {
    return {
        text,
        createdAt: new Date().getTime(),
        username
    }
}
const generateLocationMessage = (lat, long, username) => {
    return {
        url: `https://google.com/maps?q=${lat},${long}`,
        createdAt: new Date().getTime(),
        username
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}