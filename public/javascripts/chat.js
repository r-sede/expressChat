const sendButt = document.getElementById('postmessage');
const textArea = document.getElementById('content');
const messagesView = document.getElementById('messagesView');
var socket = io();

window.onload = function() {

    sendButt.addEventListener('submit', e => {
        e.preventDefault();
        fetch('/postmessage', {
            method:'POST',
            body: JSON.stringify({
                content: textArea.value
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then(function(response){
            if(!response.ok) {
                throw Error(response.statusText);
            }
            textArea.value = '';
        });
        //TODO response
    });
    
    
    socket.on("chat", getMessages);
    getMessages();
}

function appendMessage(message) {
    message.created_at = new Date(message.created_at);
    const htmlMess =
    `<div class="other messageBox">
        <span>${message.from}: </span>
        <p>${message.content}</p>
        <p>at:${message.created_at.toLocaleString()}</p>
    </div>`;
    messagesView.innerHTML += htmlMess;
}

function viewMessages (messages) {
    if(messages) {
        messagesView.innerHTML = '';
        messages = messages.reverse().map(itm => {
            itm.created_at = new Date(itm.created_at);
            const htmlMess =
            `<div class="${itm.className} messageBox">
                <span>${itm.from} </span>
                <span>at:${itm.created_at.toLocaleString()}</span>
                <p>${itm.content}</p>
            </div>`;
            messagesView.innerHTML += htmlMess;
            return itm;
        });
    }
}

function getMessages() {
    fetch('/messages', {
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then(res => res.json() ).then(viewMessages);
}
