/*jshint esversion:6*/
window.onload = function () {
    const username = document.getElementsByTagName('h2')[0];
    const img = document.getElementsByTagName('img')[0];

    fetch('/getProfile', {
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then(function (res) {
        return res.json();
    }).then(function (profile) {
        img.src = profile.avatar;
        img.alt = profile.username;
        img.title = profile.username;
        username.innerHTML = profile.username;
    });
};