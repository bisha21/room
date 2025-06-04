import React, { useState } from 'react';
import './ChatRoom.css';
import { useEffect } from 'react';

const ChatRoom = ({ socket, username, room }) => {
  const [currentMessage, setCurrentNessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const newMsg = {
      id: Math.floor(Math.random() * 1000000000),
      username,
      room,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      text: currentMessage,
    };

    await socket.emit('send_message', newMsg);
    setMessages((prevMessages) => [...prevMessages, newMsg]);
    setCurrentNessage('');
  };

  useEffect(() => {
    const receiveMessageHandler = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.on('receive_message', receiveMessageHandler);

    return () => {
      socket.off('receive_message', receiveMessageHandler); // ✅ Clean up
    };
  }, [socket]); // ✅ Add socket as dependency

  return (
    <div className="chat-room-container">
      <div className="chat-header">
        <h2> Welcome {username} to Our Chat Room</h2>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => {
          const isSender = msg.username === username;
          return (
            <div
              key={index}
              className={`chat-message ${isSender ? 'sender' : 'receiver'}`}
            >
              <div className="chat-message-header">
                <span className="username">{msg.username}</span>
                <span className="time">{msg.time}</span>
              </div>
              <div className="message-text">{msg.text}</div>
            </div>
          );
        })}
      </div>

      <form className="chat-input-form" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type a message..."
          value={currentMessage}
          onChange={(e) => setCurrentNessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatRoom;
