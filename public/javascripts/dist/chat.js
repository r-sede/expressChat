/*jshint esversion:6*/
const sendButt = document.getElementById('postmessage');
const textArea = document.getElementById('content');
const messagesView = document.getElementById('messagesView');
var socket = io();
var notifsound = new Audio('/sound/plop.m4a');

window.onload = function () {

    sendButt.addEventListener('submit', function (e) {
        e.preventDefault();
        fetch('/postmessage', {
            method: 'POST',
            body: JSON.stringify({
                content: textArea.value
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then(function (response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            textArea.value = '';
        });
        //TODO response
    });

    socket.on("chat", function () {
        getMessages(false);
    });
    getMessages(true);
};

function viewMessages(messages) {
    return new Promise(function (resolve, reject) {
        if (messages) {
            messagesView.innerHTML = '';
            messages = messages.reverse().map(function (itm) {
                itm.created_at = new Date(itm.created_at);
                //<span>${itm.from} </span>
                const htmlMess = '<div class="elc_container ' + itm.className + ' messageBox">\n                    <img src="' + itm.avatar + '" alt="' + itm.from + '" title="' + itm.from + '" class="' + itm.className + '">\n                    <p>' + itm.content + '</p>\n                    <span class="time-' + itm.className + '">at:' + itm.created_at.toLocaleString('Fr-fr') + '</span>\n                </div>';
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
    }).then(function (res) {
        return res.json();
    }).then(viewMessages).then(function () {
        if (!startup) {
            notifsound.play();
        }
    });
}