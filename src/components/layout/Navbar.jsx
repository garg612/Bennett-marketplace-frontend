import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { useEffect, useRef, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { chatService } from '../../services/chatService';
import { Button } from '../ui/Button';
import { authService } from '../../services/authService';

const formatInboxTime = (isoString) => {
  if (!isoString) {
    return '';
  }

  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [inboxConversations, setInboxConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const inboxRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      return;
    }

    let isActive = true;

    const loadInbox = async () => {
      if (document.visibilityState !== 'visible') {
        return;
      }

      const summary = await chatService.getInboxSummary();
      if (!isActive) {
        return;
      }

      const conversations = summary.conversations || [];
      setInboxConversations(conversations);
      setUnreadCount(Number(summary.totalUnread || 0));
    };

    loadInbox();
    const handleChatUpdated = () => {
      loadInbox();
    };
    window.addEventListener('chat:updated', handleChatUpdated);
    const timer = setInterval(loadInbox, 60000);

    return () => {
      isActive = false;
      window.removeEventListener('chat:updated', handleChatUpdated);
      clearInterval(timer);
    };
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!inboxRef.current?.contains(event.target)) {
        setIsInboxOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadConversations = inboxConversations
    .filter((conversation) => Number(conversation.unreadCount || 0) > 0)
    .slice(0, 5);

  const openConversation = (conversationId) => {
    setIsInboxOpen(false);
    navigate(`/chat?conversationId=${encodeURIComponent(conversationId)}`);
  };

  const navbarActionBaseClass = 'focus-ring flex min-h-[44px] items-center justify-center rounded-full border border-md-outline bg-md-surface-container text-md-on-background font-medium tracking-wide transition-all duration-300 ease-material hover:bg-md-secondary-container hover:shadow-md-sm';
  const navbarTextActionClass = `${navbarActionBaseClass} px-5`;
  const navbarIconActionClass = `${navbarActionBaseClass} h-11 w-11`;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-md-outline/35 bg-md-background/90 backdrop-blur-lg">
      <div className="mx-auto flex min-h-[72px] w-full max-w-[1280px] items-center justify-between px-6">

        {/* Left Side: Brand */}
        <Link to="/" className="focus-ring rounded-full px-2 py-1 text-card-title font-medium tracking-tight text-md-on-background transition-colors duration-300 ease-material hover:text-md-primary sm:text-subtitle">
          Bennett Marketplace
        </Link>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <Link
                to="/create-listing"
                className={`hidden sm:flex ${navbarTextActionClass} btn-primary`}
              >
                <span className="hover:text-md-primary/90 hover:text-md-primary">+ Create Listing</span>
              </Link>

              <div className="relative" ref={inboxRef}>
                <button
                  type="button"
                  onClick={() => setIsInboxOpen((prev) => !prev)}
                  className={`relative ${navbarIconActionClass}`}
                  title="Messages"
                  aria-label={`Messages${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
                >
                  <MessageCircle className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span aria-hidden="true" className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-md-tertiary px-1 text-[10px] font-bold text-md-on-tertiary">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {isInboxOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-[24px] border border-md-outline/35 bg-md-surface-container shadow-md-lg">
                    <div className="flex items-center justify-between border-b border-md-outline/30 px-4 py-3">
                      <p className="text-label font-medium text-md-on-background">Messages</p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsInboxOpen(false);
                          navigate('/chat');
                        }}
                        className="focus-ring rounded-full px-2 py-1 text-xs font-medium tracking-wide text-md-primary"
                      >
                        Open inbox
                      </button>
                    </div>

                    {unreadConversations.length === 0 ? (
                      <div className="px-4 py-6 text-sm text-md-on-background/75">No new messages.</div>
                    ) : (
                      <div className="max-h-96 overflow-y-auto">
                        {unreadConversations.map((conversation) => {
                          const lastMessage = conversation.messages?.[conversation.messages.length - 1];
                          return (
                            <button
                              key={conversation.id}
                              type="button"
                              onClick={() => openConversation(conversation.id)}
                              className="focus-ring w-full border-b border-md-outline/20 px-4 py-3 text-left transition-colors duration-300 ease-material hover:bg-md-secondary-container/60"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="truncate text-sm font-medium text-md-on-background">{conversation.participant.name}</p>
                                <span className="shrink-0 text-[10px] font-medium text-md-on-background/70">{formatInboxTime(lastMessage?.timestamp)}</span>
                              </div>
                              <p className="truncate text-xs font-medium text-md-primary">{conversation.product.title}</p>
                              <div className="flex items-center justify-between gap-2 mt-1">
                                <p className="truncate text-sm text-md-on-background/80">{lastMessage?.text || 'New message'}</p>
                                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-md-primary px-1 text-[10px] font-medium text-md-on-primary">
                                  {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Link
                to="/profile"
                className={`${navbarIconActionClass}`}
                aria-label="Open profile"
              >
                <Avatar
                  name={user.name}
                  src={user.avatar}
                  size="sm"
                  className="h-full w-full border-0 bg-transparent text-xs transition-colors"
                />
              </Link>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => authService.loginWithMicrosoft()}
            >
              Continue with Microsoft
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};