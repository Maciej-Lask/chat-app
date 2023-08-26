const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

app.use(express.static(path.join(__dirname, '/client')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const messages = [];
const activeUsers = [];

app.get(/\/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('join', (data) => {
    const author = data.author;
    console.log('User ' + author + ' has joined');

    activeUsers.push({ name: author, id: socket.id });

    socket.broadcast.emit('message', {
      author: 'Chat Bot',
      content: `<i>${author} has joined the conversation!</i>`,
    });


    console.log(activeUsers);
    console.log('User ' + author + ' has joined');
  });

  socket.on('message', (message) => {
    console.log("Oh, I've got something from " + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => {
    const index = activeUsers.findIndex((user) => user.id === socket.id);

    if (index !== -1) {
      const disconnectedUser = activeUsers.splice(index, 1)[0];


      socket.broadcast.emit('message', {
        author: 'Chat Bot',
        content: `<i>${disconnectedUser.name} has left the conversation... :(</i>`,
      });

      console.log(activeUsers);
      console.log('User ' + disconnectedUser.name + ' has left');
    }
  });

});
