import { useState } from 'react';
import io from 'socket.io-client';
import ChatRoom from './ChatApp';
const socket = io.connect('https://room-vb96.onrender.com');

const App = () => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState();
  const [showChat, setShowChat] = useState(false);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!username || !room) return;
    socket.emit('join_room', room);
    setShowChat(true);
  };

  return (
    <>
      {!showChat && (
        <div className="join-container">
          <form className="join-form" onSubmit={handleJoin}>
            <h2>Join Chat Room</h2>

            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Enter your room number"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
            />

            <button type="submit">Join</button>
          </form>
        </div>
      )}

      {showChat && <ChatRoom socket={socket} username={username} room={room} />}
    </>
  );
};

export default App;
