import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    pin: ''
  });
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // POST to /auth/signup

      try {
        const response = await fetch('/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
        const data = await response.json();

          console.log(data.message)
          // throw new Error('Network response was not ok');
        }

        const data = await response.json();

        console.log('Success:', data);
        data.token && localStorage.setItem('BNtoken', data.token);

        window.location.href = '/';
        // Handle success (e.g., redirect to login page)
      } catch (error) {
        console.error('Error:', error);
        // Handle error (e.g., show error message)
      }
    }
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
      <h1 style={styles.title}>Signup</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        {step === 1 && (
          <>
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
          </>
        )}
        {step === 2 && (
          <div style={styles.inputGroup}>
            <label style={styles.label}>PIN:</label>
            <input
              type="number"
              name="pin"
              value={formData.pin}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        )}
        <button type="submit" style={styles.button}>
          {step === 1 ? 'Next' : 'Sign Up'}
        </button>
        {step === 1 && (
          <div style={styles.linksDiv}>
            <p>Already had an account? </p><Link to="/login">log in</Link>
          </div>
        )}
      </form>
    </div>
  );
}

export default Signup;