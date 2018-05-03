/*jshint esversion:6*/
const sendButt = document.getElementById('postmessage');
const textArea = document.getElementById('content');
const messagesView = document.getElementById('messagesView');
var socket = io();
var notifsound = new Audio('/sound/plop.m4a');

window.onload = () => {
      

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
    
    
    socket.on("chat", ()=> {
        getMessages(false);
    });
    getMessages(true);
};


function viewMessages (messages) {
    return new Promise((resolve,reject) => {
        if(messages) {
            messagesView.innerHTML = '';
            messages = messages.reverse().map(itm => {
                itm.created_at = new Date(itm.created_at);
                //<span>${itm.from} </span>
                const htmlMess =
                `<div class="elc_container ${itm.className} messageBox">
                    <img src="${itm.avatar}" alt="${itm.from}" title="${itm.from}" class="${itm.className}">
                    <p>${itm.content}</p>
                    <span class="time-${itm.className}">at:${itm.created_at.toLocaleString('Fr-fr')}</span>
                </div>`;
                messagesView.innerHTML += htmlMess;
                return itm;
            });
            resolve();
        }
        reject();
    });
}

function getMessages(startup) {
    fetch('/messages', {
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then(res => res.json() ).then(viewMessages).then(()=> {
        if (!startup) {
            notifsound.play();
        }
    });
}
