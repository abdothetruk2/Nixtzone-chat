$(document).ready(function () {
  const socket = io('https://nixtzone-chat-production.up.railway.app');



  // Send message
  $('#sendButton').click(function () {
      const message = $('#chatInput').val().trim();
      if (message !== '') {
          socket.emit('message', message);
          $('#chatInput').val('');
      }
  });
  function getCookie(name) {
    let cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].split("=");
        if (cookie[0] === name) {
            return decodeURIComponent(cookie[1]);
        }
    }
    return null;
}
  // Receive message
  socket.on('receiveMessage', function (message) {
      console.log('Received message:', message);
      $('#messageArea').append(`<div class="message">
        <img src="/e.jpg" alt="User Picture">
        <div class="message-details">
          <div class="name">${getCookie("username")}</div>
          <div class="text">${message}</div>
          <div class="time">${new Date().toLocaleTimeString()}</div>
        </div>
      </div>`);
  });

});
// });
