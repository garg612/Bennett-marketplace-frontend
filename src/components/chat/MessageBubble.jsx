const formatTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const MessageBubble = ({ message, isMe }) => {
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] rounded-[20px] px-4 py-2 text-sm shadow-md-sm ${
        isMe 
          ? 'bg-md-primary text-md-on-primary' 
          : 'bg-md-surface-container text-md-on-background'
      }`}>
        <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
        <p className={`mt-1 text-right text-[10px] font-medium tracking-wide ${isMe ? 'text-md-on-primary/75' : 'text-md-on-background/65'}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};