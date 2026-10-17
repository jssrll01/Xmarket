import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Send, Search, MessageSquare, User, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Chat() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate('/login');
      } else {
        setUser(user);
        fetchRooms(user.id);
      }
    });
  }, [navigate]);

  const fetchRooms = async (userId) => {
    setLoading(true);
    const { data: participations, error } = await supabase
      .from('chat_participants')
      .select('room_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching rooms:', error);
      setLoading(false);
      return;
    }

    const roomIds = participations.map(p => p.room_id);
    if (roomIds.length === 0) {
      setRooms([]);
      setLoading(false);
      return;
    }

    const { data: allParticipants } = await supabase
      .from('chat_participants')
      .select('room_id, user_id, profiles(email, full_name, role)')
      .in('room_id', roomIds);

    const roomMap = {};
    roomIds.forEach(id => {
      roomMap[id] = { id, participants: [] };
    });

    allParticipants?.forEach(p => {
      if (roomMap[p.room_id]) {
        roomMap[p.room_id].participants.push(p);
      }
    });

    setRooms(Object.values(roomMap));
    setLoading(false);
  };

  useEffect(() => {
    if (!activeRoom) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', activeRoom.id)
        .order('created_at', { ascending: true });

      if (!error) setMessages(data || []);
    };

    fetchMessages();

    const channel = supabase
      .channel(`room-${activeRoom.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${activeRoom.id}` },
        (payload) => {
          setMessages(prev => {
            if (prev.some(m => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSearchUsers = async (query) => {
    setSearchQuery(query);
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const { data, error } = await supabase.rpc('search_users_by_email', {
      search_term: query.trim()
    });

    if (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } else {
      setSearchResults(data || []);
    }
  };

  const startChatWithUser = async (targetUser) => {
    const { data: roomId, error } = await supabase.rpc('get_or_create_chat_room', {
      target_user_id: targetUser.id
    });

    if (error) {
      console.error('Error starting chat:', error);
      alert('Failed to start chat: ' + error.message);
      return;
    }

    let roomObj = rooms.find(r => r.id === roomId);
    if (!roomObj) {
      roomObj = {
        id: roomId,
        participants: [
          { user_id: user.id, profiles: { email: user.email } },
          { user_id: targetUser.id, profiles: targetUser }
        ]
      };
      setRooms(prev => [roomObj, ...prev]);
    }

    setActiveRoom(roomObj);
    setSearchQuery('');
    setSearchResults([]);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoom || !user) return;

    const content = newMessage.trim();
    setNewMessage('');

    // Optimistic UI update for instant touch response
    const tempMsg = {
      id: 'temp-' + Date.now(),
      room_id: activeRoom.id,
      sender_id: user.id,
      content: content,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);

    const { error } = await supabase.from('chat_messages').insert({
      room_id: activeRoom.id,
      sender_id: user.id,
      content: content
    });

    if (error) {
      console.error('Send failed:', error);
      alert('Failed to send message: ' + error.message);
    }
  };

  const getOtherParticipant = (room) => {
    const other = room.participants?.find(p => p.user_id !== user?.id);
    return other?.profiles || { email: 'Chat' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 9999, background: '#f8fafc', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      {/* Top Bar: Shows Search Bar ONLY when NOT inside a chat conversation */}
      <div style={{ padding: '12px 16px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => activeRoom ? setActiveRoom(null) : navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={22} />
        </button>

        {activeRoom ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#334155' }}>
              {getOtherParticipant(activeRoom).email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>
                {getOtherParticipant(activeRoom).full_name || getOtherParticipant(activeRoom).email}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                {getOtherParticipant(activeRoom).role === 'admin' ? 'Official Shop Moderator' : getOtherParticipant(activeRoom).email}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '6px', padding: '8px 12px', border: '1px solid #e2e8f0' }}>
              <Search size={16} style={{ color: '#64748b', marginRight: '8px' }} />
              <input
                type="text"
                placeholder="Search user or moderator by Gmail..."
                value={searchQuery}
                onChange={(e) => handleSearchUsers(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px' }}
              />
            </div>

            {searchResults.length > 0 && (
              <div style={{ position: 'absolute', top: '48px', left: 0, right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 30, maxHeight: '250px', overflowY: 'auto' }}>
                {searchResults.map(resUser => (
                  <div
                    key={resUser.id}
                    onClick={() => startChatWithUser(resUser)}
                    style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                      <User size={18} style={{ color: '#64748b' }} />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>{resUser.full_name || 'User'}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{resUser.email} {resUser.role === 'admin' ? '(Moderator)' : ''}</div>
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: '#94a3b8' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {activeRoom ? (
          <>
            {/* Messages Scroll Area */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', WebkitOverflowScrolling: 'touch' }}>
              {messages.map(msg => {
                const isMe = msg.sender_id === user?.id;
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '75%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: isMe ? '#2563eb' : '#ffffff',
                      color: isMe ? '#ffffff' : '#1e293b',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      fontSize: '14px',
                      wordBreak: 'break-word'
                    }}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} style={{ padding: '12px 16px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
              />
              <button type="submit" style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          /* Conversations List */
          <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', WebkitOverflowScrolling: 'touch' }}>
            <div style={{ padding: '16px 16px 8px 16px', fontSize: '14px', fontWeight: 'bold', color: '#64748b' }}>Recent Conversations</div>
            {loading ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Loading chats...</div>
            ) : rooms.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                <MessageSquare size={40} style={{ marginBottom: '10px', color: '#cbd5e1' }} />
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#334155' }}>No messages yet</div>
                <div style={{ fontSize: '13px', marginTop: '4px' }}>Search a Gmail address above to start chatting with buyers or moderators.</div>
              </div>
            ) : (
              rooms.map(room => {
                const other = getOtherParticipant(room);
                return (
                  <div
                    key={room.id}
                    onClick={() => setActiveRoom(room)}
                    style={{
                      padding: '14px 16px',
                      background: '#ffffff',
                      borderBottom: '1px solid #f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#334155' }}>
                        {other.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>{other.full_name || other.email}</div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>
                          {other.role === 'admin' ? 'Moderator / Shop' : other.email}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} style={{ color: '#cbd5e1' }} />
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
