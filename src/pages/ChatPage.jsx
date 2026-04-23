import { useEffect, useState } from 'react';
import { Package, ArrowLeft } from 'lucide-react'; // 1. Added ArrowLeft import
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { chatService } from '../services/chatService';
import { useAuth } from '../hooks/useAuth';

// Import our newly architected components!
import { ConversationList } from '../components/chat/ConversationList';
import { ProductContextCard } from '../components/chat/ProductContextCard';
import { ChatThread } from '../components/chat/ChatThread';
import { MessageInput } from '../components/chat/MessageInput';

export const ChatPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const requestedProductId = searchParams.get('productId');
  const requestedParticipantId = searchParams.get('participantId');
  const requestedConversationId = searchParams.get('conversationId');
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // State to toggle mobile view (List vs Active Chat)
  const [showMobileList, setShowMobileList] = useState(true);

  useEffect(() => {
    const loadConversations = async () => {
      setIsLoading(true);
      setError('');

      try {
        let data = await chatService.getAllConversations();
        let nextActiveChatId = data[0]?.id || null;

        if (requestedProductId) {
          const startedChat = await chatService.startConversation(requestedProductId, requestedParticipantId || undefined);
          if (startedChat) {
            const exists = data.some((chat) => String(chat.id) === String(startedChat.id));
            data = exists
              ? data.map((chat) => (String(chat.id) === String(startedChat.id) ? startedChat : chat))
              : [startedChat, ...data];
            nextActiveChatId = startedChat.id;
            setShowMobileList(false);
          }
        }

        if (requestedConversationId) {
          const requested = data.find((chat) => String(chat.id) === String(requestedConversationId));
          if (requested) {
            nextActiveChatId = requested.id;
            setShowMobileList(false);
          }
        }

        setConversations(data);
        setActiveChatId(nextActiveChatId);
      } catch (loadError) {
        setError(loadError.message || 'Unable to load conversations.');
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, [requestedConversationId, requestedParticipantId, requestedProductId]);

  const activeChat = conversations.find(c => c.id === activeChatId);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChat) return;

    const persistedMessage = await chatService.addMessage(activeChat.id, {
      text: messageText
    });
    if (!persistedMessage) return;

    const updatedConversations = conversations.map(chat => {
      if (chat.id === activeChat.id) {
        return { ...chat, messages: [...chat.messages, persistedMessage] };
      }
      return chat;
    });

    setConversations(updatedConversations);
    setMessageText('');
  };

  // 2. Added handler to select chat and hide the list on mobile
  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setShowMobileList(false);
  };

  useEffect(() => {
    if (!activeChatId) {
      return;
    }

    setConversations((prev) => prev.map((chat) => (
      String(chat.id) === String(activeChatId)
        ? { ...chat, unreadCount: 0 }
        : chat
    )));
    chatService.markConversationRead(activeChatId);
  }, [activeChatId]);

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-20">
      <PageHeader title="Messages" />

      {isLoading && (
        <div className="py-16 flex justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {!isLoading && error && (
        <ErrorMessage
          title="Unable to load chats"
          message={error}
          action={<Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>}
        />
      )}

      {/* 3. Added relative positioning to the main container */}
      {!isLoading && !error && (
      <div className="relative flex h-[600px] overflow-hidden rounded-[24px] bg-md-surface-container shadow-md-md">
        
        {/* Left Panel - Hidden on mobile if viewing a thread */}
        <div className={`w-full md:w-80 shrink-0 ${showMobileList ? 'block' : 'hidden md:block'}`}>
          <ConversationList 
            conversations={conversations}
            activeChatId={activeChatId}
            onSelectChat={handleSelectChat}
          />
        </div>

        {/* Right Panel - Hidden on mobile if viewing the list */}
        <div className={`flex-1 flex-col w-full relative ${showMobileList ? 'hidden md:flex' : 'flex'}`}>
          {activeChat ? (
            <>
              {/* 4. Mobile Back Button (Only visible on small screens) */}
              <div className="flex items-center border-b border-md-outline/35 bg-md-surface-container p-2 md:hidden">
                <button 
                  onClick={() => setShowMobileList(true)}
                  className="focus-ring flex min-h-[44px] items-center rounded-full border border-md-outline px-4 py-2 text-sm font-medium text-md-on-background transition-all duration-300 ease-material hover:bg-md-secondary-container"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Messages
                </button>
              </div>

              <ProductContextCard 
                participant={activeChat.participant} 
                product={activeChat.product} 
              />
              
              <ChatThread messages={activeChat.messages} currentUserId={user?.id} />
              
              <MessageInput 
                messageText={messageText}
                onMessageChange={setMessageText}
                onSendMessage={handleSendMessage}
              />
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center bg-md-surface-container-low text-md-on-background">
              <Package className="mb-4 h-12 w-12 text-md-on-background/50" />
              <p className="font-medium">Select a conversation to start messaging</p>
            </div>
          )}
        </div>

      </div>
      )}
    </div>
  );
};