import React, { useEffect, useState } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const quotes = [
  "Believe in yourself 💪",
  "Dream it. Do it 🌟",
  "Start where you are. Use what you have. Do what you can 💼",
  "Progress over perfection 🚀"
];

export default function GoalList() {
  const [goals, setGoals] = useState([]);
  const [quote, setQuote] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const authInstance = getAuth();

  useEffect(() => {
    fetchGoals(filter);
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [filter]);

  const fetchGoals = async (selectedFilter) => {
    if (!auth.currentUser) return;

    const goalQuery = query(
      collection(db, 'goals'),
      where('user', '==', auth.currentUser.email)
    );
    const snapshot = await getDocs(goalQuery);
    let goalList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (selectedFilter === 'completed') {
      goalList = goalList.filter(goal => goal.completed === true);
    } else if (selectedFilter === 'incomplete') {
      goalList = goalList.filter(goal => !goal.completed);
    }
    setGoals(goalList);
  };

  const handleLogout = () => {
    signOut(authInstance)
      .then(() => {
        navigate('/login');
      })
      .catch(error => {
        alert("Logout failed: " + error.message);
      });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div
      style={{
        position: 'fixed',        // make it fixed for full viewport
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflowY: 'auto',        // scroll inside the div if content overflows
        backgroundImage: `url('https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=1350&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: 'white',
        textShadow: '2px 2px 5px rgba(0,0,0,0.7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
        zIndex: 0,
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 0,
        }}
      />

      {/* Content container with higher zIndex so it stays above overlay */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '600px' }}>
        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.05, backgroundColor: '#8b1a1a' }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 18px',
            backgroundColor: '#b22222',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
            userSelect: 'none',
            transition: 'background-color 0.3s ease',
            zIndex: 2,
          }}
        >
          Logout
        </motion.button>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '2px' }}
          >
            🎯 My Goals
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            style={{ fontStyle: 'italic', fontSize: '1.4rem', marginTop: '10px' }}
          >
            "{quote}"
          </motion.p>

          {/* Filter Buttons */}
          <div style={{ marginTop: '25px' }}>
            {['all', 'incomplete', 'completed'].map((type) => (
              <motion.button
                key={type}
                onClick={() => setFilter(type)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '10px 20px',
                  marginRight: '15px',
                  backgroundColor: filter === type ? '#4caf50' : 'rgba(119,119,119,0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  boxShadow: filter === type ? '0 0 15px #4caf50' : 'none',
                  userSelect: 'none',
                  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.ul
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            listStyle: 'none',
            padding: 0,
            width: '100%',
            marginTop: '15px',
          }}
        >
          {goals.length === 0 ? (
            <motion.li
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                fontSize: '1.3rem',
                fontWeight: '600',
                opacity: 0.7,
                padding: '30px 0',
                userSelect: 'none',
              }}
            >
              No goals to display here.
            </motion.li>
          ) : (
            goals.map(goal => (
              <motion.li
                key={goal.id}
                variants={itemVariants}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  margin: '12px 0',
                  padding: '18px 24px',
                  borderRadius: '14px',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: goal.completed ? '#a5d6a7' : 'white',
                  backdropFilter: 'blur(7px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                  textAlign: 'center',
                  userSelect: 'none',
                  cursor: 'default',
                  textDecoration: goal.completed ? 'line-through' : 'none',
                  opacity: goal.completed ? 0.7 : 1,
                  transition: 'color 0.3s ease, opacity 0.3s ease',
                }}
                whileHover={{ scale: 1.03 }}
              >
                {goal.text}
              </motion.li>
            ))
          )}
        </motion.ul>
      </div>
    </div>
  );
}
