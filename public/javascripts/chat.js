const sendButt = document.getElementById('postmessage');
const textArea = document.getElementById('content');
const messagesView = document.getElementById('messagesView');
const socket = io();

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
    });
    //TODO response
});

socket.on("chat", addChat);
function viewMessages(messages) {
    if(messages) {
        messages = messages.map(itm => {
            itm.created_at = new Date(itm.created_at);
            const htmlMess =
            `<div class="${itm.className} messageBox">
                <span>${itm.from} </span>
                <p>${itm.content}</p>
                <p>at:${itm.created_at.toLocaleString()}</p>
            </div>`;
            messagesView.innerHTML += htmlMess;
            return itm;
        });
    }
    
}

fetch('/messages', {
    headers: {
        'Content-Type': 'application/json'
    },
    credentials: 'include'
}).then(res => res.json() ).then(viewMessages);