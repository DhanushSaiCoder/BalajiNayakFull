import React, { useState } from 'react';
import '../home.css';

function Home() {
  if (!localStorage.getItem('BNtoken')) {
    window.location.href = '/login';
  }

  const [currPeriod, setCurrPeriod] = useState(1);
  const [isLeisure, setIsLeisure] = useState(false);
  const [isSubstitution, setIsSubstitution] = useState(false);
  const [classValue, setClassValue] = useState(1);
  const [branch, setBranch] = useState('MPC');
  const [year, setYear] = useState(1);
  const [section, setSection] = useState('A');

  const [data, setData] = useState({
    date: new Date().toISOString(),
    periods: []
  });

  const [periodData, setPeriodData] = useState({
    class: classValue,
    section: section,
    isSubstitution: isSubstitution,
    isLeisure: isLeisure,
    branch,
    year
  });

  const handleLeisureChange = (e) => {
    updatePeriodData({ isLeisure: e.target.checked });
    setIsLeisure(e.target.checked);
  };
  const handleSubstitutionChange = (e) => {
    updatePeriodData({ isSubstitution: e.target.checked });
    setIsSubstitution(e.target.checked);
  };

  const handleClassEntry = (e) => {
    updatePeriodData({ class: e.target.value });
    setClassValue(e.target.value);
  };

  const handleBranchChange = (e) => {
    updatePeriodData({ branch: e.target.value });
    setBranch(e.target.value);
  };

  const handleYearChange = (e) => {
    updatePeriodData({ year: e.target.value });
    setYear(e.target.value);
  };

  const handleSectionChange = (e) => {
    updatePeriodData({ section: e.target.value });
    setSection(e.target.value);
  };

  const updatePeriodData = (updatedData) => {
    setPeriodData((prev) => {
      return { ...prev, ...updatedData };
    });
  };

  console.log(periodData);
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
          <div className='enterAttendanceContainer'>
            <div className='enterAttendanceHeader'>
              <button className='prevPeriod'>&lt;&lt; Previous Period</button>
              <h2>Period - 1</h2>
            </div>
            <div className='enterAttendanceContentContainer'>
              <div className='enterAttendanceContent'>
                <div className='container'>
                  <div className="checkbox-group">
                    <label>
                      <input onChange={handleLeisureChange} className='checkboxes' type="checkbox" name="leisure" />
                      Leisure ?
                    </label>
                    <label onChange={handleSubstitutionChange} className={isLeisure ? "formDisabled" : ""}>
                      <input disabled={isLeisure} className={isLeisure ? "checkboxes formDisabled" : "checkboxes"} type="checkbox" name="substitution" />
                      Substitution ?
                    </label>
                  </div>

                  <label className={isLeisure ? "formDisabled" : ""} htmlFor="class">CLASS</label>
                  <input onChange={handleClassEntry} disabled={isLeisure} type="number" id="class" min="1" max="12" placeholder="1 - 12" />

                  <div className="branch-group">
                    <span className={isLeisure || classValue <= 10 ? "formDisabled" : ""} >BRANCH</span>
                    <div className="branches">
                      <label className={isLeisure || classValue <= 10 ? "formDisabled" : ""} >
                        <input onChange={handleBranchChange} disabled={isLeisure} type="radio" name="branch" value="MPC" defaultChecked />
                        MPC
                      </label>
                      <label onChange={handleBranchChange} className={isLeisure || classValue <= 10 ? "formDisabled" : ""} >
                        <input disabled={isLeisure} type="radio" name="branch" value="BIPC" />
                        BIPC
                      </label>
                      <label onChange={handleBranchChange} className={isLeisure || classValue <= 10 ? "formDisabled" : ""} >
                        <input disabled={isLeisure} type="radio" name="branch" value="MBIPC" />
                        MBIPC
                      </label>
                    </div>
                  </div>

                  <div className="year-group">
                    <span className={isLeisure || classValue <= 10  ? "formDisabled" : ""} >YEAR</span>
                    <div className="years">
                      <label className={isLeisure || classValue <= 10  ? "formDisabled" : ""} >
                        <input onChange={handleYearChange} disabled={isLeisure} type="radio" name="year" value="1" defaultChecked />
                        1
                      </label>
                      <label className={isLeisure  || classValue <= 10 ? "formDisabled" : ""} >
                        <input onChange={handleYearChange} disabled={isLeisure} type="radio" name="year" value="2" />
                        2
                      </label>
                    </div>
                  </div>


                  <div className="section-group">
                    <span className={isLeisure ? "formDisabled" : ""} >SECTION</span>
                    <div className="sections">
                      <label className={isLeisure ? "formDisabled" : ""} >
                        <input onChange={handleSectionChange} disabled={isLeisure} type="radio" name="section" value="A" defaultChecked />
                        A
                      </label>
                      <label className={isLeisure ? "formDisabled" : ""} >
                        <input onChange={handleSectionChange} disabled={isLeisure} type="radio" name="section" value="B" />
                        B
                      </label>
                      <label className={isLeisure ? "formDisabled" : ""} >
                        <input onChange={handleSectionChange} disabled={isLeisure} type="radio" name="section" value="C" />
                        C
                      </label>
                      <label className={isLeisure ? "formDisabled" : ""} >
                        <input onChange={handleSectionChange} disabled={isLeisure} type="radio" name="section" value="D" />
                        D
                      </label >
                      <label className={isLeisure ? "formDisabled" : ""} >
                        <input onChange={handleSectionChange} disabled={isLeisure} type="radio" name="section" value="E" />
                        E
                      </label>
                    </div>
                  </div>

                  <button className='nextPeriod' type="button">Next Period &gt;&gt;</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;