import { Avatar } from '../ui/Avatar';

// Helper function to format the timestamp
const formatTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const ConversationItem = ({ chat, isActive, onClick }) => {
  const lastMessage = chat.messages[chat.messages.length - 1];
  const unreadCount = Number(chat.unreadCount || 0);
  const buttonLabel = `Open conversation with ${chat.participant.name} about ${chat.product.title}`;

  return (
    <button
      onClick={onClick}
      aria-label={buttonLabel}
      aria-current={isActive ? 'true' : undefined}
      className={`focus-ring flex w-full gap-3 border-b border-md-outline/20 p-4 text-left transition-all duration-300 ease-material ${
        isActive ? 'border-l-4 border-l-md-primary bg-md-secondary-container/65' : 'border-l-4 border-l-transparent hover:bg-md-secondary-container/45'
      }`}
    >
      <div className="relative shrink-0">
        <Avatar src={chat.participant.avatar} name={chat.participant.name} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-md-primary px-1 text-[10px] font-medium text-md-on-primary">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <h4 className="truncate text-sm font-medium text-md-on-background">{chat.participant.name}</h4>
          <span className="shrink-0 text-xs text-md-on-background/70">
            {formatTime(lastMessage?.timestamp)}
          </span>
        </div>
        <p className="mb-1 truncate text-xs font-medium text-md-primary">{chat.product.title}</p>
        <p className={`truncate text-sm ${unreadCount > 0 ? 'font-medium text-md-on-background' : 'text-md-on-background/70'}`}>
          {lastMessage?.text || "No messages yet."}
        </p>
      </div>
    </button>
  );
};