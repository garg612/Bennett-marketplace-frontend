import { MessageBubble } from './MessageBubble';
import { useEffect,useRef } from 'react';

export const ChatThread = ({ messages, currentUserId }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

  return (
    <div className="flex-1 space-y-4 overflow-y-auto bg-md-surface-container-low p-6">
      {messages.map((msg) => (
        <MessageBubble 
          key={msg.id} 
          message={msg} 
          isMe={String(msg.senderId) === String(currentUserId)} 
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};