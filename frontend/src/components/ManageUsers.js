import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './ManageUsers.css'; // Optional: Create a CSS file for styling

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = () => {
    navigate('/register'); // Navigate to your user addition route
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/auth/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(users.filter((user) => user._id !== id));
        toast.success('User deleted successfully!'); // Show success toast
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const { username, email, role, password, fullName } = selectedUser;

    try {
      await axios.put(`http://localhost:5000/api/auth/users/${selectedUser._id}`, {
        username,
        email,
        role,
        fullName,
        password: password || undefined,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setUsers(users.map(user => (user._id === selectedUser._id ? selectedUser : user)));
      setShowModal(false);
      setSelectedUser(null);
      toast.success('User updated successfully!'); // Show success toast
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error updating user.'); // Show error toast
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="manage-users-container">
          <h2>Manage Users</h2>
          <button onClick={handleAddUser} className="add-user-button">Add New User</button>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>S.N.</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>
                      <button onClick={() => handleEditUser(user)} className="edit-button">Edit</button>
                      <button onClick={() => handleDeleteUser(user._id)} className="delete-button">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit User Modal */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
              <h3>Edit User</h3>
              <form onSubmit={handleUpdateUser}>
                <label>Full Name:</label>
                <input
                  type="text"
                  name="fullName"
                  value={selectedUser.fullName}
                  onChange={handleInputChange}
                  required
                />
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  value={selectedUser.username}
                  onChange={handleInputChange}
                  required
                />
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={selectedUser.email}
                  onChange={handleInputChange}
                  required
                />
                <label>Role:</label>
                <select
                  name="role"
                  value={selectedUser.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Leave blank to keep current password"
                  onChange={handleInputChange}
                />
                <button type="submit">Update User</button>
              </form>
            </div>
          </div>
        )}

        <Footer />
      </div>
      <ToastContainer /> {/* Add ToastContainer for notifications */}
    </div>
  );
};

export default ManageUsers;
