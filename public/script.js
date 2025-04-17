const socket = io();
const qrImg = document.getElementById('qrcode');
const statusDiv = document.getElementById('status');
const form = document.getElementById('message-form');

socket.on('qr', qr => {
  const qrURL = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qr)}&size=200x200`;
  qrImg.src = qrURL;
});

socket.on('ready', () => {
  statusDiv.innerText = '✅ WhatsApp conectado!';
  qrImg.style.display = 'none';
});

socket.on('message', msg => {
  statusDiv.innerText = msg;
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(form);

  const res = await fetch('/send', {
    method: 'POST',
    body: formData
  });

  const text = await res.text();
  alert(text);
  form.reset();
});
