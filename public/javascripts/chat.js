const sendButt = document.getElementById('postmessage');
const textArea = document.getElementById('content');

sendButt.addEventListener('submit', e => {
    e.preventDefault();
    console.log(textArea.value);
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
});