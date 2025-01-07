import React, { useState } from 'react';
import { Link } from 'react-router-dom';
function Login() {
  const baseURL = 'https://balajinayakfull.onrender.com'

  if (localStorage.getItem('BNtoken')) {
    window.location.href = '/'
  }
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data sending to server...', formData);
    // POST to /auth/login
    fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json();
          console.log(data.message)
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        data.token && localStorage.setItem('BNtoken', data.token);
        window.location.href = '/';
        // Handle success (e.g., redirect to login page)
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle error (e.g., show error message)
      });
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f0f2f5',
    },
    form: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      width: '300px',


    },
    inputGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    button: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#007bff',
      color: '#fff',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    title: {
      marginBottom: '20px',
    },
    linksDiv: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '10px',
      opacity: 0.85
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            placeholder='eg. abc@gmail.com'
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Login</button>
        <div style={styles.linksDiv}>
          <p>Don't have an account? </p><Link to="/signup">create new account</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;