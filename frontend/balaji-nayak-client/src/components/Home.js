import React from 'react';

function Home() {
  if (!localStorage.getItem('BNtoken')) {
    window.location.href = '/login'
  }
  return <h1>Home Page</h1>;
}

export default Home;