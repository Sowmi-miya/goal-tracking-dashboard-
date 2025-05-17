import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [userName, setUserName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const navigate = useNavigate();

  const fetchUserName = async () => {
    if (!auth.currentUser) return;
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      setUserName(userData.name || 'Boss');
    } else {
      setUserName('Boss');
    }
  };

  const fetchGoals = async () => {
    if (!auth.currentUser) return;

    const goalQuery = query(
      collection(db, 'goals'),
      where('user', '==', auth.currentUser.email)
    );

    const snapshot = await getDocs(goalQuery);
    const goalList = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a, b) => a.completed - b.completed); // Incomplete first
    setGoals(goalList);
  };

  const addGoal = async () => {
    if (newGoal.trim()) {
      await addDoc(collection(db, 'goals'), {
        text: newGoal,
        user: auth.currentUser.email,
        completed: false,
        createdAt: serverTimestamp(),
      });
      setNewGoal('');
      fetchGoals();
    }
  };

  const deleteGoal = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      await deleteDoc(doc(db, 'goals', id));
      fetchGoals();
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    await updateDoc(doc(db, 'goals', id), { completed: !currentStatus });
    fetchGoals();
  };

  const startEditing = (goal) => {
    setEditingId(goal.id);
    setEditText(goal.text);
  };

  const saveEdit = async (id) => {
    if (editText.trim()) {
      await updateDoc(doc(db, 'goals', id), { text: editText });
      setEditingId(null);
      fetchGoals();
    }
  };

  useEffect(() => {
    fetchUserName();
    fetchGoals();
  }, []);

  return (
    <div
      style={{
        width: '100vw',          // Full viewport width
        height: '100vh',         // Full viewport height
        backgroundImage:
          "url('https://i.pinimg.com/originals/6c/90/44/6c9044d8711e567bf703afc6627af59e.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        fontFamily: "'Poppins', sans-serif",
        overflowY: 'auto',
        padding: '20px',
        color: '#fff',
      }}
    >
      {/* Dark overlay for readability */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 0,
        }}
      />

      {/* Main content container */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '700px',
          margin: 'auto',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 0 15px rgba(0,0,0,0.7)',
        }}
      >
        <h2 style={{ marginBottom: '20px', fontWeight: '600' }}>
          Welcome, {userName} 👋
        </h2>

        <div style={{ display: 'flex', marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Enter your boss goal..."
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 15px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              marginRight: '10px',
              outline: 'none',
            }}
          />
          <button
            onClick={addGoal}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#b22222',
              color: '#fff',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#800000')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#b22222')}
          >
            Add
          </button>
        </div>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {goals.map((goal) => (
            <li
              key={goal.id}
              style={{
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: '10px',
                padding: '10px 15px',
                backgroundColor: goal.completed ? '#155724' : '#343a40',
                color: goal.completed ? '#d4edda' : '#f8f9fa',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ flex: 1 }}>
                {editingId === goal.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '16px',
                      outline: 'none',
                    }}
                  />
                ) : (
                  <>
                    <strong>{goal.text}</strong>
                    <div style={{ fontSize: '0.85rem', color: goal.completed ? '#c3e6cb' : '#adb5bd' }}>
                      {goal.completed ? '✅ Completed' : '⏳ In Progress'}
                    </div>
                  </>
                )}
              </div>

              <div style={{ marginLeft: '15px', display: 'flex', gap: '8px' }}>
                {editingId === goal.id ? (
                  <button
                    onClick={() => saveEdit(goal.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: '#007bff',
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => toggleComplete(goal.id, goal.completed)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: goal.completed ? '#ffc107' : '#28a745',
                        color: '#fff',
                        cursor: 'pointer',
                      }}
                      title={goal.completed ? 'Undo Complete' : 'Mark Complete'}
                    >
                      {goal.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button
                      onClick={() => startEditing(goal)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#17a2b8',
                        color: '#fff',
                        cursor: 'pointer',
                      }}
                      title="Edit goal"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        cursor: 'pointer',
                      }}
                      title="Delete goal"
                    >
                      ❌
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>

        <button
          onClick={() => navigate('/mygoals')}
          style={{
            marginTop: '25px',
            padding: '12px 25px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: '#343a40',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            fontSize: '18px',
          }}
        >
          Go To My Goals
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
