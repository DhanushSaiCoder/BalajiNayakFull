  import React, { useState } from 'react';
  import { Link } from 'react-router-dom';
  import './spinner.css'

  function Login() {
    const baseURL = 'https://balajinayakfull.onrender.com';

    if (localStorage.getItem('BNtoken')) {
      window.location.href = '/';
    }

    const [formData, setFormData] = useState({
      email: '',
      password: ''
    });
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
      if (!formData.email || !formData.password) {
        setErrMsg('');
        setEmptyCredentials(true);
        return;
      } else {
        setErrMsg('');
        setEmptyCredentials(false);
      }

      console.log("Form data sending to server...", formData);
      setIsLoading(true);

      try {
        const response = await fetch(`${baseURL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          setErrMsg(data.message);
          setIsLoading(false);
          return;
        } else {
          setErrMsg('');
        }

        console.log("Success:", data);

        if (data.token) {
          localStorage.setItem("BNtoken", data.token);
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Error logging in:", error);
        alert("Something went wrong. Please try again later.");
      } finally {
        setIsLoading(false);
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
        cursor: isLoading ? 'not-allowed' : 'pointer',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
        opacity: 0.85
      },
      errDiv: {
        width: "100%",
        display: 'flex',
        alignItems: 'center',
        justifyContent: "center",
        margin: '10px',
        color: 'red'
      },
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
          {errMsg && (
            <div style={styles.errDiv}>
              <p>{errMsg}</p>
            </div>
          )}
          {emptyCredentials && (
            <div style={styles.errDiv}>
              <p>Invalid Entries.</p>
            </div>
          )}
          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? <div style={styles.spinner}></div> : 'Login'}
          </button>
          <div style={styles.linksDiv}>
            <p>Don't have an account? </p><Link to="/signup">create new account</Link>
          </div>
        </form>
      </div>
    );
  }

  export default Login;
