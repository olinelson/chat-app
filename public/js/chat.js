const socket = io()


// elements
const $messages = document.querySelector('#messagesContainer')
const $messageForm = document.querySelector('#messageForm')
const $messageFormButton = $messageForm.querySelector('button')
const $messageFormInput = $messageForm.querySelector('input')
const $shareLocationButton = document.querySelector('#shareLocationButton')

// templates
const messageTemplate = document.querySelector('#messageTemplate').innerHTML
const locationMessageTemplate = document.querySelector('#locationMessageTemplate').innerHTML
const sideBarTemplate = document.querySelector(`#sideBarTemplate`).innerHTML

// options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoScroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // visible height
    const visibleHeight = $messages.offsetHeight

    // height of messages container
    const containerHeight = $messages.scrollHeight

    // how far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }


}

socket.on('message', ({ text, createdAt, username }) => {
    const html = Mustache.render(messageTemplate, {
        message: text,
        createdAt: moment(createdAt).format('h:m a'),
        username
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('locationMessage', ({ url, createdAt, username }) => {
    console.log(url)
    const html = Mustache.render(locationMessageTemplate, {
        url,
        createdAt: moment(createdAt).format('h:m a'),
        username
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sideBarTemplate, {
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML = html

})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let message = $messageFormInput.value
    $messageFormButton.setAttribute('disabled', 'disabled')


    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.focus()
        if (error) {
            $messageFormInput.value = message
            return console.log(error)
        }
        console.log('message delivered')
        $messageFormInput.value = ''
    })



})

$shareLocationButton.addEventListener('click', () => {
    $shareLocationButton.setAttribute('disabled', 'disabled')
    if (!navigator.geolocation) {
        $shareLocationButton.removeAttribute('disabled')
        return alert('Geo location is not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        $shareLocationButton.removeAttribute('disabled')
        console.log(position);
        latitude = position.coords.latitude
        longitude = position.coords.longitude

        socket.emit('sendLocation', { latitude, longitude }, (error) => {
            if (error) {
                return console.log(error)
            }
            console.log('Location Shared')
        })

    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }

})

