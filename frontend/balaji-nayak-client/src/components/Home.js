import React from 'react';
import '../home.css'
function Home() {
  if (!localStorage.getItem('BNtoken')) {
    window.location.href = '/login'
  }
  return (
    <>
      <div className='leftNav'>
        <div className='navHeaderDiv'>
          <h1>ATTENDANCE TRACKER</h1>
        </div>
        <div className='navContentDiv'>
          <h1>content</h1>
        </div>
        <div className='navFooterDiv'>
          <h1>footer</h1>
        </div>
      </div>
    </>
  );
}

export default Home;