// Referencje do elementów HTML
const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

const socket = io();
socket.on('message', ({ author, content }) => addMessage(author, content));

let userName = '';

loginForm.addEventListener('submit', function (event) {
  event.preventDefault();
  login(event);
});
addMessageForm.addEventListener('submit', function (event) {
  event.preventDefault();
  sendMessage(event);
});

function login(event) {
  event.preventDefault();
  const enteredUserName = userNameInput.value;

  if (enteredUserName.trim() === '') {
    alert('Wprowadź nazwę użytkownika.');
    return;
  }

  userName = enteredUserName;

  // Toggle show class
  loginForm.classList.remove('show');
  messagesSection.classList.add('show');

  console.log('Zalogowano jako: ' + userName);
  socket.emit('join', { author: userName});
}

function sendMessage(event) {
  event.preventDefault();
  const messageContent = messageContentInput.value;
  console.log(messageContent);
  if (messageContent.trim() === '') {
    alert('Wprowadź treść wiadomości.');
    return;
  }
  else {
  addMessage(userName, messageContent);
  socket.emit('message', { author: userName, content: messageContent });
  messageContentInput.value = '';
  }
}

function addMessage(author, content) {
  const newMessage = document.createElement('li');
  newMessage.className = 'message  message--received ';
  if (author === userName) {
    newMessage.classList.add('message--self');
  }
  newMessage.innerHTML = `
        <h3 class="message__author">${author === userName ? 'You' : author}</h3>
        <div class="message__content">${content}</div>
    `;

  messagesList.appendChild(newMessage);
}
