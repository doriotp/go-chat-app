let socket;
let roomId;
let roomName;
let username;
let userId;

function generateUserId() {
    return 'user-' + Math.random().toString(36).substr(2, 9);
}

function joinExistingRoom() {
    username = document.getElementById('join-username').value;
    userId = generateUserId();

    if (username) {
        document.getElementById('join-room').style.display = 'none';
        joinRoom(roomId, roomName);
    } else {
        alert('Please enter your username');
    }
}

function joinRoom(roomId, roomName) {
    document.getElementById('room-name').textContent = `Room: ${roomName}`;
    document.getElementById('chat-room').style.display = 'block';

    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${location.host}/ws/joinRoom/${roomId}?userId=${userId}&username=${username}`;

    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        console.log('Connected to the chat room');
    };

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        displayMessage(message);
    };

    socket.onclose = () => {
        console.log('Disconnected from the chat room');
    };
}

function sendMessage() {
    // const input = document.getElementById('message-input');
    // const message = input.value;

    // if (message) {
    //     const msg = {
    //         content: message,
    //         roomId: roomId,
    //         username: username
    //     };

    //     socket.send(JSON.stringify(msg));
    //     input.value = '';
    // }
        const input = document.getElementById('message-input');
        const message = input.value;
    
        if (message) {
            socket.send(message); // Send just the message content
    
            // Optionally clear the input field after sending
            input.value = '';
        }
    }

function displayMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');

    console.log(message)

    // Display the message content along with the username
    messageElement.textContent = `${message.username}: ${message.content}`;
    
    // Optionally, you can style the message for better readability
    messageElement.style.padding = '5px';
    messageElement.style.marginBottom = '5px';
    messageElement.style.borderRadius = '5px';
    messageElement.style.backgroundColor = '#f0f0f0';
    messageElement.style.border = '1px solid #ccc';
    messageElement.style.maxWidth = '80%';
    messageElement.style.wordWrap = 'break-word';

    messagesDiv.appendChild(messageElement);
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    roomId = urlParams.get('roomId');
    roomName = urlParams.get('roomName');

    if (roomId && roomName) {
        document.getElementById('join-room').style.display = 'block';
    }
});
