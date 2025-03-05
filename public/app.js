$(document).ready(function () {
  const socket = io('http://localhost:5000');
    socket.emit("getUsers",socket.id);
socket.on("users", function (users) { 


  $(".online-users").append(` <li class="text-center">
                <img src="/e.jpg" alt="User">
                <div> 
                  <div> ${users[users.length-1].username}</div>
                  <div style="font-size:12px">${users[users.length-1].email} </div>
                </div>
              </li>`);


})  
  // Send message
  $('#sendButton').click(function () {
      const message = $('#chatInput').val().trim();
      if (message !== '') {
          socket.emit('message', {message: message , email:getCookie("username")});
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
  socket.on('receiveMessage', function (data) {
      console.log('Received message:', data);
      $('#messageArea').append(`<div class="message">
        <img src="/e.jpg" alt="User Picture">
        <div class="message-details ">
          <div class="name">${data.email}</div>
          <div class="text">${data.message}</div>
          <div class="time">${new Date().toLocaleTimeString()}</div>
        </div>
      </div>`);   });

 
    $("#ball").draggable();

  $("#ball").dblclick(function(){
    alert("You double-clicked me!");


  });    


});
// });