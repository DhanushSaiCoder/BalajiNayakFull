import React, { useState, useEffect } from 'react';
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
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dayReport, setDayReport] = useState([]);
  const [data, setData] = useState({
    date: new Date().toISOString(),
    periods: [{}, {}, {}, {}, {}, {}, {}, {}]
  });

  const [periodData, setPeriodData] = useState({
    class: classValue,
    section: section,
    isSubstitution: isSubstitution,
    isLeisure: isLeisure,
    branch,
    year
  });
  const currDate = new Date();
  const formattedDate = currDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
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

  const handleNextPeriod = () => {
    if (currPeriod < 8) {
      setData(prevData => {
        const updatedPeriods = [...prevData.periods];
        updatedPeriods[currPeriod - 1] = periodData;
        return { ...prevData, periods: updatedPeriods };
      });
      setCurrPeriod(period => period + 1);
    } else {
      setData(prevData => {
        const updatedPeriods = [...prevData.periods];
        updatedPeriods[currPeriod - 1] = periodData;
        return { ...prevData, periods: updatedPeriods };
      });

      setReadyToSubmit(true);
    }
  };

  const handlePreviousPeriod = () => {
    if (currPeriod === 1) return;
    setCurrPeriod(period => period - 1);
  };

  useEffect(() => {
    if (readyToSubmit) {
      fetch('http://localhost:5000/months/day', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('BNtoken')}`
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          setReadyToSubmit(false);
          saveData(data);
          setSubmitted(true);
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('Attendance entry failed!');
        });
    }
  }, [readyToSubmit, data]);

  const saveData = (data) => {
    const monthId = data._id;

    // Fetch day by sending GET request to /months/day with JWT token in headers
    fetch(`http://localhost:5000/months/${monthId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('BNtoken')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        const date = new Date().toISOString().split('T')[0]; // Extract only the date part
        const day = data.days.find(day => day.date.split('T')[0] === date) || { 'day not found': true };
        const periods = day.periods;
        generateDayReport(periods);

      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Fetching day failed!');
      });
  };

  const generateDayReport = (periods) => {
    const report = periods
    console.log('report: ', report)
    setDayReport(report);
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
          <button onClick={() => {
            localStorage.removeItem('BNtoken')
            window.location.href = '/login'
          }} className='logoutBtn'>Log Out</button>
        </div>
        <div className='contentHeader'>
          <h1>Enter Attendance</h1>
          <p className='secondaryTxt'>Date: {formattedDate}</p>
        </div>
        <div className='mainContent'>
          <div className='enterAttendanceContainer'>
            <div className='enterAttendanceHeader'>
              {!submitted && (
                <button onClick={handlePreviousPeriod} className='prevPeriod'>&lt;&lt; Previous Period</button>
              )}
              {!submitted ? <h2>Period - {currPeriod}</h2> : <h2>Attendance Submitted</h2>}
            </div>
            <div className='enterAttendanceContentContainer'>
              {!submitted && (
                <div className='enterAttendanceContent'>
                  <div className='container'>
                    <div className="checkbox-group">
                      <label style={{ color: 'rgba(255, 78, 33, 0.99)' }}>

                        <input onChange={handleLeisureChange} className='checkboxes' type="checkbox" name="leisure" />
                        Leisure ?
                      </label>
                      <label style={{ color: 'rgb(0, 187, 255)' }} className={isLeisure ? "formDisabled" : ""}>
                        <input onChange={handleSubstitutionChange} disabled={isLeisure} className={isLeisure ? "checkboxes formDisabled" : "checkboxes"} type="checkbox" name="substitution" />
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
                        <label className={isLeisure || classValue <= 10 ? "formDisabled" : ""} >
                          <input onChange={handleBranchChange} disabled={isLeisure} type="radio" name="branch" value="BIPC" />
                          BIPC
                        </label>
                        <label className={isLeisure || classValue <= 10 ? "formDisabled" : ""} >
                          <input onChange={handleBranchChange} disabled={isLeisure} type="radio" name="branch" value="MBIPC" />
                          MBIPC
                        </label>
                      </div>
                    </div>

                    <div className="year-group">
                      <span className={isLeisure || classValue <= 10 ? "formDisabled" : ""} >YEAR</span>
                      <div className="years">
                        <label className={isLeisure || classValue <= 10 ? "formDisabled" : ""} >
                          <input onChange={handleYearChange} disabled={isLeisure} type="radio" name="year" value="1" defaultChecked />
                          1
                        </label>
                        <label className={isLeisure || classValue <= 10 ? "formDisabled" : ""} >
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

                    <button onClick={handleNextPeriod} className='nextPeriod' type="button">Next Period &gt;&gt;</button>
                  </div>

                </div>
              )}
              {dayReport.length > 0 && (
                <div className='dayReport'>
                  <h3>Day Report</h3>
                  <table className='dayReportTable'>
                    <thead>
                      <tr>
                        <th>Peroiod</th>
                        <th>class</th>
                        <th>branch</th>
                        <th>year</th>
                        <th>Substitution</th>
                      </tr>
                    </thead>
                    <tbody>

                      {dayReport.map((period, index) => (
                        <tr key={index}>
                          <td><b>{index + 1}</b></td>
                          {period.isLeisure && <td className='leisureRow' colSpan={4}><b>Leisure</b></td>}
                          {!period.isLeisure && (
                            <>
                              <td className={period.isSubstitution ? "substitutionRow" : ""}>{period.class + " " + period.section}</td>
                              <td className={period.isSubstitution ? "substitutionRow" : ""}>{period.class > 10 ? period.branch : '-'}</td>
                              <td className={period.isSubstitution ? "substitutionRow" : ""}>{period.class > 10 ? period.year : '-'}</td>
                              <td className={period.isSubstitution ? "substitutionRow" : ""}>{period.isSubstitution ? 'Yes' : 'No'}</td>
                            </>
                          )}

                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className='okayBtnDiv'>
                    <button className='noBtn'>No</button>
                    <button className='okayBtn'>Okay</button>
                  </div>
                </div>

              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;