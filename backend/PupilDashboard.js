import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
const socket = io(API_URL);

// This component assumes the pupil's data is available after login.
// It also assumes the pupil object has a `mentorId` field.
const PupilDashboard = ({ pupil }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const mentorId = pupil.mentorId; // This needs to come from your user data

    // Setup Socket.io listeners
    useEffect(() => {
        // Join a room for this pupil to receive messages
        socket.emit('join', pupil.id);

        // Listen for new messages
        socket.on('new_message', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        // Clean up socket listener on component unmount
        return () => {
            socket.off('new_message');
        };
    }, [pupil.id]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !mentorId) {
            if (!mentorId) console.error("No mentor assigned to this pupil.");
            return;
        }

        const messagePayload = {
            recipientId: mentorId,
            senderId: pupil.id,
            text: newMessage,
        };

        socket.emit('private_message', messagePayload);

        // Add sent message to local state immediately
        setMessages(prevMessages => [...prevMessages, { ...messagePayload, timestamp: new Date() }]);
        setNewMessage('');
    };

    return (
        <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '20px auto' }}>
            <h2>Chat with your Mentor</h2>
            {!mentorId && <p style={{ color: 'orange' }}>You are not currently assigned to a mentor.</p>}

            <div style={{ border: '1px solid #ccc', padding: '10px' }}>
                <div style={{ height: '400px', overflowY: 'auto', borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                    {messages.map((msg, index) => (
                        <div key={index} style={{ textAlign: msg.senderId === pupil.id ? 'right' : 'left' }}>
                            <p style={{ display: 'inline-block', padding: '5px 10px', borderRadius: '10px', backgroundColor: msg.senderId === pupil.id ? '#dcf8c6' : '#f1f0f0' }}>
                                {msg.text}
                            </p>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        style={{ width: '80%' }}
                        placeholder="Type a message..."
                        disabled={!mentorId}
                    />
                    <button type="submit" disabled={!mentorId}>Send</button>
                </form>
            </div>
        </div>
    );
};

export default PupilDashboard;