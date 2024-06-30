let socket;
let roomId;
let roomName;
let username;
let userId;

function generateRoomId() {
    return 'room-' + Math.random().toString(36).substr(2, 9);
}

function createRoom() {
    const roomNameInput = document.getElementById('room-name-input').value;
    roomId = generateRoomId();

    if (roomNameInput) {
        fetch('/ws/createRoom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: roomId, name: roomNameInput })
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('room-creation').style.display = 'none';
                // history.pushState(null, "", `/room/${roomId}?name=${roomNameInput}`);
                // window.location.href = `./join-room?roomId=${roomId}&roomName=${roomNameInput}`;
                window.location.href = `/joinroom?roomId=${roomId}&roomName=${roomNameInput}`;
            })
            .catch(error => {
                console.error('Error creating room:', error);
            });
    } else {
        alert('Please enter room name and your username');
    }
}
