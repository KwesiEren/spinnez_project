import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// This component assumes the admin's data (id, token) is available,
// perhaps from a context or parent component after login.
const AdminDashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Ref for auth token
    const authToken = useRef(user.token);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/users`, {
                headers: { 'x-access-token': authToken.current }
            });
            setUsers(response.data);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            console.error('Failed to fetch users:', errorMessage);
            setError(`Failed to fetch users: ${errorMessage}`);
        }
    };

    // Fetch users on component mount
    useEffect(() => {
        if (authToken.current) {
            fetchUsers();
        }
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        setMessage('');
        setError('');
        try {
            const response = await axios.put(
                `${API_URL}/api/admin/users/${userId}/role`,
                { role: newRole },
                { headers: { 'x-access-token': authToken.current } }
            );
            setMessage(response.data.message || 'Role updated successfully!');
            // Refresh users list to show the change
            fetchUsers();
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            console.error('Failed to update role:', errorMessage);
            setError(`Failed to update role: ${errorMessage}`);
        }
    };

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
            <h2>Super Admin Portal: User Management</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #ccc' }}>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Username</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Email</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Current Role</th>
                        <th style={{ textAlign: 'left', padding: '8px' }}>Change Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '8px' }}>{user.username}</td>
                            <td style={{ padding: '8px' }}>{user.email}</td>
                            <td style={{ padding: '8px' }}>{user.role}</td>
                            <td style={{ padding: '8px' }}>
                                <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)}>
                                    <option value="pupil">Pupil</option>
                                    <option value="mentor">Mentor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;