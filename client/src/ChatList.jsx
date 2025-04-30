import React from 'react';

const ChatList = ({ domain, chats }) => {
  return (
    <ul className={`chat-list ${domain}`}>
      {chats.map((chat, index) => (
        <li key={index}>
          {domain === 'image' ? (
            <img src={chat.message} alt={`Generated ${index}`} width={100} />
          ) : (
            <p>{chat.message}</p>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ChatList;
