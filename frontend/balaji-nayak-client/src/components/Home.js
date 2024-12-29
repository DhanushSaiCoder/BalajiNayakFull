import React from 'react';
import '../home.css'
import App from './../App';
function Home() {

  if (!localStorage.getItem('BNtoken')) {
    window.location.href = '/login'
  }
  return (
    <div className='HomeContainer'>
      <div className='leftNav'>
        <div className='navHeaderDiv'>
          <h1>ATTENDANCE TRACKER</h1>
        </div>
        <div className='navContentDiv'>
          <button className='navButtons activeNavBtn'>Enter Attendance</button>
          <button className='navButtons'>Reports</button>
        </div>
        <div className='navFooterDiv'>
          <p>dhanushsai1467@gmail.com</p>
        </div>
      </div>

      <main>
        <div className='mainHeader'>
          <button className='logoutBtn'>Log Out</button>
        </div>
        <div className='contentHeader'>
          <h1>Enter Attendance</h1>
          <p className='secondaryTxt'>Date: 29-12-24</p>
        </div>
        <div className='mainContent'>
          {/* <h1>ehfaksh</h1> */}
          <div className='enterAttendanceContainer'>
            <div className='enterAttendanceHeader'>
              <button className='prevPeriod'>&lt;&lt; Previous Period</button>
              <h2>Period - 1</h2>
            </div>
            <div className='enterAttendanceContentContainer'>
              <div className='enterAttendanceContent'>
                <div className="container">
                  <label htmlFor="class">CLASS</label>
                  <input type="number" id="class" min="1" max="12" placeholder="1 - 12" />
                  
                  <div className="branch-group">
                    <span>BRANCH</span>
                    <div className="branches">
                      <label>
                        <input type="radio" name="branch" value="MPC" defaultChecked />
                        MPC
                      </label>
                      <label>
                        <input type="radio" name="branch" value="BIPC" />
                        BIPC
                      </label>
                      <label>
                        <input type="radio" name="branch" value="MBIPC" />
                        MBIPC
                      </label>
                      
                    </div>
                  </div>

                  <div className="year-group">
                    <span>YEAR</span>
                    <div className="years">
                      <label>
                        <input type="radio" name="year" value="1" defaultChecked />
                        1
                      </label>
                      <label>
                        <input type="radio" name="year" value="2" />
                        2
                      </label>
                     
                      
                    </div>
                  </div>
                  
                  <div className="section-group">
                    <span>SECTION</span>
                    <div className="sections">
                      <label>
                        <input type="radio" name="section" value="A" defaultChecked />
                        A
                      </label>
                      <label>
                        <input type="radio" name="section" value="B" />
                        B
                      </label>
                      <label>
                        <input type="radio" name="section" value="C" />
                        C
                      </label>
                      <label>
                        <input type="radio" name="section" value="D" />
                        D
                      </label>
                      <label>
                        <input type="radio" name="section" value="E" />
                        E
                      </label>
                    </div>
                  </div>

                  <div className="checkbox-group">
                    <label>
                      <input className='checkboxes' type="checkbox" name="substitution" />
                      Substitution ?
                    </label>
                    <label>
                      <input className='checkboxes' type="checkbox" name="leisure" />
                      Leisure ?
                    </label>
                  </div>

                  <button className='nextPeriod' type="button">Next Period &gt;&gt;</button>
                </div>
              </div></div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;