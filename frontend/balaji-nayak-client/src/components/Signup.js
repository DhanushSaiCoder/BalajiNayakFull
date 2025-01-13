import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './spinner.css';

function Signup() {
  const baseURL = 'https://balajinayakfull.onrender.com';
  const navigate = useNavigate(); // For redirecting to /signup

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    pin: ''
  });
  const [step, setStep] = useState(1);
  const [errMsg, setErrMsg] = useState('');
  const [emptyCredentials, setEmptyCredentials] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are entered before proceeding to the next step
    if (step === 1) {
      if (!formData.email || !formData.password) {
        setErrMsg('Please fill in all fields.');
        setEmptyCredentials(true); // Set emptyCredentials state to true
        return; // Stop execution here to avoid further processing
      } else {
        setErrMsg(''); // Clear any previous error message
        setEmptyCredentials(false); // Set emptyCredentials state to false
        setStep(2); // Proceed to the next step if fields are valid
      }
    } else {
      if (!formData.pin) {
        setErrMsg('Please enter your PIN.');
        return;
      }

      if (formData.pin.length !== 4) { // Example PIN validation
        setErrMsg('PIN should be 4 digits long.');
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${baseURL}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (!response.ok) {
          setErrMsg(data.message);
          setIsLoading(false);
          return;
        }

        if (data.token) {
          localStorage.setItem('BNtoken', data.token);
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error:', error);
        setErrMsg('Something went wrong. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTryAgain = () => {
    setStep(1); // Redirect to /signup if "Try Again" button is clicked
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
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '10px 0'
    },
    spinner: {
      width: '20px',
      height: '20px',
      border: '3px solid #fff',
      borderTop: '3px solid #007bff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
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
      opacity: 0.85,
    },
    errDiv: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '10px',
      color: 'red',
    },
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
        {errMsg && (
          <div style={styles.errDiv}>
            <p>{errMsg}</p>
          </div>
        )}
        {emptyCredentials && !errMsg && (
          <div style={styles.errDiv}>
            <p>Please fill in all fields.</p>
          </div>
        )}

        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? <div style={styles.spinner}></div> : (step === 1 ? 'Next' : 'Sign Up')}
        </button>


        {/* Only show "Try Again" button when an error occurs */}
        {errMsg && !isLoading && step === 2 && (
          <button type="button" onClick={handleTryAgain} style={styles.button}>
            Try Again
          </button>
        )}

        {step === 1 && (
          <div style={styles.linksDiv}>
            <p>Already have an account?</p>
            <Link to="/login">Log in</Link>
          </div>
        )}
      </form>
    </div>
  );
}

export default Signup;
