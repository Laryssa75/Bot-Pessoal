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

  try{
  const res = await fetch('/api/send', {
    method: 'POST',
    body: formData
  });

  const data = await res.json(); //recebe a resposta do json

  alert(data.mensagem || 'Mensagem enviada com sucesso!');

  //Se houver erros específicos, mostra
  const erros = data.resultados
    ?.filter(r => r.status === 'erro');
  if (erros ?.length) {
    const msgErro = erros.map(e => `${e.numero}: ${e.erro}`).join('\n');
    alert('❌ Erros no envio :\n\n' + msgErro);
  }

  form.reset(); // <- dentro do try, apenas se deu tudo certo
  } catch (err) {
    alert('❌ Erro ao enviar requisição: ' + err.message);
  }

  // const text = await res.text();
  // alert(text);
  // form.reset();
});
