import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
const socket = io(API_URL);

// This component assumes the mentor's data (id, token) is available,
// perhaps from a context or parent component after login.
const MentorDashboard = () => {
    const { user: mentor } = useAuth();
    const [pupils, setPupils] = useState([]);
    const [selectedPupil, setSelectedPupil] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [voteTopic, setVoteTopic] = useState('quarterly_review');
    const [voteValue, setVoteValue] = useState(5);

    // Ref for auth token
    const authToken = useRef(mentor.token); // Assuming token is passed in mentor prop

    // Fetch assigned pupils on component mount
    useEffect(() => {
        const fetchPupils = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/mentor/pupils`, {
                    headers: { 'x-access-token': authToken.current }
                });
                setPupils(response.data);
            } catch (error) {
                console.error('Failed to fetch pupils:', error.response?.data?.message || error.message);
            }
        };

        if (authToken.current) {
            fetchPupils();
        }
    }, []);

    // Setup Socket.io listeners
    useEffect(() => {
        // Join a room for this mentor to receive messages
        socket.emit('join', mentor.id);

        // Listen for new messages
        socket.on('new_message', (message) => {
            // Only update messages if the message is from the selected pupil
            if (selectedPupil && message.senderId === selectedPupil.id) {
                setMessages(prevMessages => [...prevMessages, message]);
            }
        });

        // Clean up socket listener on component unmount
        return () => {
            socket.off('new_message');
        };
    }, [mentor.id, selectedPupil]);

    const handleSelectPupil = (pupil) => {
        setSelectedPupil(pupil);
        setMessages([]); // Clear messages when switching pupils
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedPupil) return;

        const messagePayload = {
            recipientId: selectedPupil.id,
            senderId: mentor.id,
            text: newMessage,
        };

        socket.emit('private_message', messagePayload);

        // Add sent message to local state immediately
        setMessages(prevMessages => [...prevMessages, { ...messagePayload, timestamp: new Date() }]);
        setNewMessage('');
    };

    const handleCastVote = async () => {
        if (!selectedPupil) {
            alert('Please select a pupil to vote for.');
            return;
        }

        try {
            await axios.post(`${API_URL}/api/vote`,
                {
                    subjectId: selectedPupil.id,
                    topic: voteTopic,
                    value: voteValue,
                },
                { headers: { 'x-access-token': authToken.current } }
            );
            alert(`Vote cast for ${selectedPupil.username}!`);
        } catch (error) {
            console.error('Failed to cast vote:', error.response?.data?.message || error.message);
            alert('Failed to cast vote.');
        }
    };

    return (
        <div style={{ display: 'flex', fontFamily: 'sans-serif' }}>
            <div style={{ width: '25%', borderRight: '1px solid #ccc', padding: '10px' }}>
                <h2>My Pupils</h2>
                {pupils.map(pupil => (
                    <div key={pupil.id} onClick={() => handleSelectPupil(pupil)} style={{ padding: '10px', cursor: 'pointer', backgroundColor: selectedPupil?.id === pupil.id ? '#e0e0e0' : 'transparent' }}>
                        {pupil.username}
                    </div>
                ))}
            </div>

            <div style={{ width: '75%', padding: '10px' }}>
                {selectedPupil ? (
                    <div>
                        <h2>Interacting with {selectedPupil.username}</h2>

                        {/* Voting Section */}
                        <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
                            <h3>Vote</h3>
                            <input type="text" value={voteTopic} onChange={e => setVoteTopic(e.target.value)} placeholder="Vote Topic" />
                            <input type="number" value={voteValue} onChange={e => setVoteValue(parseInt(e.target.value, 10))} min="1" max="10" />
                            <button onClick={handleCastVote}>Cast Vote</button>
                        </div>

                        {/* Chat Section */}
                        <div style={{ border: '1px solid #ccc', padding: '10px' }}>
                            <h3>Chat</h3>
                            <div style={{ height: '300px', overflowY: 'auto', borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
                                {messages.map((msg, index) => (
                                    <div key={index} style={{ textAlign: msg.senderId === mentor.id ? 'right' : 'left' }}>
                                        <p style={{ display: 'inline-block', padding: '5px 10px', borderRadius: '10px', backgroundColor: msg.senderId === mentor.id ? '#dcf8c6' : '#f1f0f0' }}>
                                            {msg.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleSendMessage}>
                                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} style={{ width: '80%' }} placeholder="Type a message..." />
                                <button type="submit">Send</button>
                            </form>
                        </div>
                    </div>
                ) : <p>Select a pupil to begin.</p>}
            </div>
        </div>
    );
};

export default MentorDashboard;