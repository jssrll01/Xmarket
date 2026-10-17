import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { ArrowLeft, Send, Search, MessageSquare, User } from 'lucide-react';
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

  // Fetch rooms the user participates in
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

    // Get all participants for these rooms to display names/emails
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

  // Fetch messages and subscribe to real-time updates for active room
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
          setMessages(prev => [...prev, payload.new]);
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

  // Search users by Gmail
  const handleSearchUsers = async (query) => {
    setSearchQuery(query);
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .ilike('email', `%${query.trim()}%`)
      .neq('id', user.id)
      .limit(5);

    if (!error) {
      setSearchResults(data || []);
    }
  };

  // Start or open a chat room with another user
  const startChatWithUser = async (targetUser) => {
    // Check if room already exists between user and targetUser
    const { data: myRooms } = await supabase
      .from('chat_participants')
      .select('room_id')
      .eq('user_id', user.id);

    const myRoomIds = myRooms?.map(r => r.room_id) || [];

    if (myRoomIds.length > 0) {
      const { data: sharedRooms } = await supabase
        .from('chat_participants')
        .select('room_id')
        .eq('user_id', targetUser.id)
        .in('room_id', myRoomIds);

      if (sharedRooms && sharedRooms.length > 0) {
        // Room already exists
        const existingRoomId = sharedRooms[0].room_id;
        const existingRoom = rooms.find(r => r.id === existingRoomId) || {
          id: existingRoomId,
          participants: [{ user_id: targetUser.id, profiles: targetUser }]
        };
        setActiveRoom(existingRoom);
        setSearchQuery('');
        setSearchResults([]);
        return;
      }
    }

    // Create new room
    const { data: newRoom, error: roomError } = await supabase
      .from('chat_rooms')
      .insert({})
      .select()
      .single();

    if (roomError) {
      alert('Failed to create chat room');
      return;
    }

    // Add participants
    await supabase.from('chat_participants').insert([
      { room_id: newRoom.id, user_id: user.id },
      { room_id: newRoom.id, user_id: targetUser.id }
    ]);

    const roomObj = {
      id: newRoom.id,
      participants: [
        { user_id: user.id, profiles: { email: user.email } },
        { user_id: targetUser.id, profiles: targetUser }
      ]
    };

    setRooms(prev => [roomObj, ...prev]);
    setActiveRoom(roomObj);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoom) return;

    const content = newMessage.trim();
    setNewMessage('');

    const { error } = await supabase.from('chat_messages').insert({
      room_id: activeRoom.id,
      sender_id: user.id,
      content: content
    });

    if (error) {
      console.error('Send failed:', error);
    }
  };

  const getOtherParticipant = (room) => {
    const other = room.participants?.find(p => p.user_id !== user?.id);
    return other?.profiles || { email: 'Chat' };
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', fontFamily: 'sans-serif' }}>
      {/* Sidebar: Conversations & Search */}
      <div style={{ width: '350px', borderRight: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Messages</h2>
        </div>

        {/* Search Gmail */}
        <div style={{ padding: '12px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '8px', padding: '8px 12px' }}>
            <Search size={16} style={{ color: '#64748b', marginRight: '8px' }} />
            <input
              type="text"
              placeholder="Search user by Gmail..."
              value={searchQuery}
              onChange={(e) => handleSearchUsers(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px' }}
            />
          </div>

          {searchResults.length > 0 && (
            <div style={{ position: 'absolute', top: '60px', left: '12px', right: '12px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 10, maxHeight: '200px', overflowY: 'auto' }}>
              {searchResults.map(resUser => (
                <div
                  key={resUser.id}
                  onClick={() => startChatWithUser(resUser)}
                  style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <User size={16} style={{ color: '#64748b' }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{resUser.full_name || 'User'}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{resUser.email} {resUser.role === 'admin' ? '(Moderator)' : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Room List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Loading chats...</div>
          ) : rooms.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
              No conversations yet.<br />Search a Gmail above to start chatting!
            </div>
          ) : (
            rooms.map(room => {
              const other = getOtherParticipant(room);
              const isActive = activeRoom?.id === room.id;
              return (
                <div
                  key={room.id}
                  onClick={() => setActiveRoom(room)}
                  style={{
                    padding: '14px 16px',
                    cursor: 'pointer',
                    background: isActive ? '#eff6ff' : 'transparent',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#334155' }}>
                    {other.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>{other.full_name || other.email}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {other.role === 'admin' ? 'Moderator / Shop' : other.email}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
        {activeRoom ? (
          <>
            {/* Header */}
            <div style={{ padding: '16px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#334155' }}>
                {getOtherParticipant(activeRoom).email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>
                  {getOtherParticipant(activeRoom).full_name || getOtherParticipant(activeRoom).email}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {getOtherParticipant(activeRoom).role === 'admin' ? 'Official Shop Moderator' : getOtherParticipant(activeRoom).email}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map(msg => {
                const isMe = msg.sender_id === user?.id;
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidt: '60%',
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

            {/* Input Bar */}
            <form onSubmit={sendMessage} style={{ padding: '16px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px' }}
              />
              <button type="submit" style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <MessageSquare size={48} style={{ marginBottom: '12px', color: '#cbd5e1' }} />
            <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#334155' }}>Your Messages</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Select a conversation from the sidebar or search by Gmail to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
