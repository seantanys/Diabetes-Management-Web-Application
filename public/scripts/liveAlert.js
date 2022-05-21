const socket = io();
toastr.options = {
    timeOut: 2000,
    positionClass : 'toast-bottom-right',
    extendedTimeOut: 0,
    fadeOut: 0,
    fadeIn: 0,
    showDuration: 0,
    hideDuration: 0,
    debug: false
};

socket.on('new-notification', (resp) => {
  toastr.success(resp, 'New notification')
});

function sendMessage() {
  let msg = document.getElementById('msg').value;
  if(msg.trim() !== '') {
    socket.emit("send-notification", msg);
  }
  
}