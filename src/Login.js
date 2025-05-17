import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Login successful:", userCredential.user);
        navigate("/dashboard");
      })
      .catch((error) => {
        alert("Login failed: " + error.message);
      });
  };

  const styles = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundImage: `url('https://static1.makeuseofimages.com/wordpress/wp-content/uploads/2018/11/dark-wallpapers.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    form: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)', // Dark transparent background for contrast
      padding: '40px',
      borderRadius: '10px',
      boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)',
      color: '#fff',
      minWidth: '320px',
      maxWidth: '400px',
      width: '90%',
      textAlign: 'center',
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      margin: '12px 0',
      borderRadius: '6px',
      border: 'none',
      fontSize: '16px',
    },
    button: {
      width: '100%',
      padding: '12px',
      marginTop: '20px',
      borderRadius: '6px',
      border: 'none',
      backgroundColor: '#b22222',  // Bossy deep red color
      color: 'white',
      fontSize: '18px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    link: {
      color: '#ffa07a', // Light salmon for links
      textDecoration: 'none',
    },
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: i => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.15 + 0.6, duration: 0.4 }
    })
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0 0 12px #b22222' },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      style={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.form
        style={styles.form}
        onSubmit={handleLogin}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h2
          style={{ marginBottom: '20px' }}
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Login
        </motion.h2>

        <motion.input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
          custom={0}
          variants={inputVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
          custom={1}
          variants={inputVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.button
          type="submit"
          style={styles.button}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Login
        </motion.button>

        <motion.p
          style={{ marginTop: '15px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          Don’t have an account?{' '}
          <Link to="/signup" style={styles.link}>
            Sign up here
          </Link>
        </motion.p>
      </motion.form>
    </motion.div>
  );
}
