import React, { useState, useEffect, use } from 'react';
import '../home.css';

function Home() {
  if (!localStorage.getItem('BNtoken')) {
    window.location.href = '/login';
  }
  const currDate = new Date();
  const currDay = currDate.getDate()
  const currMonth = currDate.getMonth() + 1; // Months are 0-based, so add 1
  const currYear = currDate.getFullYear();

  const [currPage, setCurrPage] = useState('enterAttendance');

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
  const [enteredToday, setEnteredToday] = useState(false);
  const [data, setData] = useState({
    date: new Date().toISOString(),
    periods: [{}, {}, {}, {}, {}, {}, {}, {}]
  });



  //report states:
  const [userMonths, setUserMonths] = useState([])

  const [reqMonths, setReqMonths] = useState([])

  const [reqPeriods, setReqPeriods] = useState([])

  const [reportData, setReportData] = useState([])

  const [fromDate, setfromDate] = useState(`${currYear}-${currMonth}-${currDay}`)
  const [toDate, setToDate] = useState(`${currYear}-${currMonth}-${currDay}`)

  const [fromDateObj, setFromDateObj] = useState({})
  const [toDateObj, setToDateObj] = useState({})



  const [periodData, setPeriodData] = useState({
    class: classValue,
    section: section,
    isSubstitution: isSubstitution,
    isLeisure: isLeisure,
    branch,
    year
  });

  const formattedDate = currDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const handlePageChange = (page) => {
    setCurrPage(page);
  }

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
  const handleNo = () => {
    window.location.reload();
  }

  const handleYes = () => {
    setEnteredToday(true);
  }

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


  useEffect(() => {
    if (currPage === 'reports') {
      console.log('Fetching user months...')
      fetch('http://localhost:5000/months', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('BNtoken')}`
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log('Got Users months.', data.months)

          storeUserMonths(data);
        }
        )
        .catch((error) => {
          console.error('Error:', error);
          alert('Fetching user months failed!');
        });
    }
  }, [currPage]);

  const storeUserMonths = (data) => {
    const months = data.months;
    setUserMonths(months)
  }

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
    setDayReport(report);
  }

  const handleFromDateChange = (e) => {
    setfromDate(e.target.value)
  }

  const handleToDateChange = (e) => {
    setToDate(e.target.value)

  }

  const handleGetReport = () => {
    const [fromyear, frommonth, formdate] = fromDate.split('-').map(Number);
    setFromDateObj((prev) => {
      return {
        ...prev,
        year: fromyear,
        month: frommonth,
        date: formdate
      }
    })

    const [toyear, tomonth, todate] = toDate.split('-').map(Number);
    setToDateObj((prev) => {
      return {
        ...prev,
        year: toyear,
        month: tomonth,
        date: todate
      }
    })


  }

  useEffect(() => {
    if (Object.keys(fromDateObj).length === 0) return;
    addValidMonthsFromDate(fromDateObj)
  }, [fromDateObj]);


  useEffect(() => {
    if (Object.keys(toDateObj).length === 0) return;
    removeInvalidMonthsToDate(toDateObj)
  }, [toDateObj]);

  // Utility function to validate date object
  const validateDateObj = (dateObj) => {
    return (
      dateObj &&
      typeof dateObj.year === "number" &&
      typeof dateObj.month === "number"
    );
  };

  // Add valid months from userMonths to reqMonths
  const addValidMonthsFromDate = (dateObj) => {
    if (!validateDateObj(dateObj)) {
      console.error("Invalid dateObj passed to addValidMonthsFromDate");
      return;
    }

    setReqMonths((prev) => {
      // Filter valid months from userMonths
      const newMonths = userMonths.filter((month) => {
        return (
          month &&
          typeof month.year === "number" &&
          typeof month.month === "number" &&
          (month.year > dateObj.year ||
            (month.year === dateObj.year && month.month >= dateObj.month))
        );
      });

      const combined = [...prev, ...newMonths];

      // Remove months less than from month (dateObj.month) in the combined list
      const filteredMonths = combined.filter((month) => {
        return (
          month.year > dateObj.year ||
          (month.year === dateObj.year && month.month >= dateObj.month)
        );
      });

      // Remove duplicates
      return filteredMonths.filter(
        (month, index, self) =>
          index === self.findIndex((m) => m.year === month.year && m.month === month.month)
      );
    });
  };


  // Remove invalid months from reqMonths
  const removeInvalidMonthsToDate = (dateObj) => {
    if (!validateDateObj(dateObj)) {
      console.error("Invalid dateObj passed to removeInvalidMonthsToDate");
      return;
    }

    setReqMonths((prev) => {
      const filtered = prev.filter((month) => {
        return (
          month &&
          typeof month.year === "number" &&
          typeof month.month === "number" &&
          (month.year < dateObj.year ||
            (month.year === dateObj.year && month.month <= dateObj.month))
        );
      });

      // Return the same array if no changes, to avoid unnecessary state updates
      return filtered.length === prev.length ? prev : filtered;
    });
  };



  useEffect(() => {
    if (reqMonths.length == 0) return;
    let TempReqDays = []
    reqMonths.forEach((month) => TempReqDays.push(month.days));

    const TempReqDays2 = []

    for (let i = 0; i < TempReqDays.length; i++) {
      for (let j = 0; j < TempReqDays[i].length; j++)
        TempReqDays2.push(TempReqDays[i][j])
    }
    TempReqDays = TempReqDays2

    //Remove unwanted days

    let ReqDays = []

    for (let i = 0; i < TempReqDays.length; i++) {
      const dateString = TempReqDays[i].date;
      const date = new Date(dateString);
      const result = {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1, // Months are zero-indexed in JS
        date: date.getUTCDate()
      };


      //result.year >= fromDateObj.year && month && date - push it to ReqDays;
      if ((result.year >= fromDateObj.year && result.month >= fromDateObj.month && result.date >= fromDateObj.date) &&
        (result.year <= toDateObj.year && result.month <= toDateObj.month && result.date <= toDateObj.date)) {
        ReqDays.push(TempReqDays[i])
      }
    }

    // get all the periods from each index of ReqDays
    let ReqPeriods = []
    for (let i in ReqDays) {
      ReqPeriods.push(ReqDays[i].periods)
    }

    let nonLeisurePeriods = []
    for (let i in ReqPeriods) {
      for (let p in ReqPeriods[i]) {
        if (!ReqPeriods[i][p].isLeisure) {
          nonLeisurePeriods.push(ReqPeriods[i][p])
        }
      }
    }

    setReqPeriods((prev) => {
      return [...nonLeisurePeriods]
    })
  }, [reqMonths]);

  useEffect(() => {
    if (reqPeriods.length == 0) return console.log('No classes attended.');
    console.log('reqPeriods: ', reqPeriods);
    //convert the reqPeriods data to this format: (neglect duplicates) 
    // class: 1-A / 11-MPC-2yr-A
    // regular: 5
    // substitution: 1
    // total: 6

    let convertedReqPeriods = []
    // iterate through the reqPeriods,if not leisure,create an object containing the data above, push to convertedReqPeriods

    for (let i in reqPeriods) {
      let period = reqPeriods[i]
      if (!period.isLeisure) {
        let data = {
          class: period.class < 11 ?
            `${period.class}-${period.section}` :
            `${period.class}-${period.branch}-${period.year}yr-${period.section}`,
          isSubstitution: period.isSubstitution
        }
        convertedReqPeriods.push(data)
      }
    }

    console.log('converted reqPeriods: ', convertedReqPeriods)

    //iterate through each period in convertedReqPe
    // and count its instances when substitution & !substitution, 
    // if a period not exists in finalData, 
    // push it


    let periods = convertedReqPeriods

    function countPeriods(periods) {
      let result = [];

      periods.forEach(period => {
        let existingClass = result.find(item => item.class === period.class);

        if (existingClass) {
          if (period.isSubstitution) {
            existingClass.substitution++;
          } else {
            existingClass.regular++;
          }
        } else {
          result.push({
            class: period.class,
            substitution: period.isSubstitution ? 1 : 0,
            regular: period.isSubstitution ? 0 : 1
          });
        }
      });

      return result;
    }

    const addTotal = (periods) => {
      //for each instance of the periods, 
      // add total: sub+reg
      let output = []
      periods.forEach((period) => {
        let periodData = {
          class: period.class,
          substitution: period.substitution,
          regular: period.regular,
          total: period.substitution + period.regular
        }
        output.push(periodData)
      })

      setReportData(output)
    }

    let finalData = countPeriods(periods);
    finalData = addTotal(finalData)

  }, [reqPeriods])


  reportData.length != 0 && console.log('reportData: ', reportData);



  return (
    <div className='HomeContainer'>
      <div className='leftNav'>
        <div className='navHeaderDiv'>
          <h1>ATTENDANCE TRACKER</h1>
        </div>
        <div className='navContentDiv'>
          <button onClick={() => handlePageChange('enterAttendance')} className={currPage === 'enterAttendance' ? 'navButtons activeNavBtn' : 'navButtons'}>Enter Attendance</button>
          <button onClick={() => handlePageChange('reports')} className={currPage === 'reports' ? 'navButtons activeNavBtn' : 'navButtons'}>Reports</button>
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
          <h1>{currPage === "enterAttendance" ? "Enter Attendance" : "Reports"}</h1>
          {currPage === 'enterAttendance' && <p className='secondaryTxt'>Date: {formattedDate}</p>}

        </div>
        <div className='mainContent'>
          {currPage === 'reports' && (
            <>
              <div className='reportsContainer'>
                <div className='reportsHeader'>
                  <div id="fromDiv" className='reportsHeaderInputDiv'>
                    <label htmlFor="from">
                      FROM:
                      <input defaultValue={fromDate} onChange={handleFromDateChange} className='dataInp' type="date" id="from" />
                    </label>
                  </div>
                  <div id="toDiv" className='reportsHeaderInputDiv'>
                    <label htmlFor="from">
                      TO:
                      <input defaultValue={fromDate} onChange={handleToDateChange} className='dataInp' type="date" id="from" />
                    </label>
                  </div>
                  <div id="getReportBtnDiv" className='reportsHeaderInputDiv'>
                    <button onClick={handleGetReport}>Get Report</button>
                  </div>
                </div>
                <div className='reportsContent'>
                  {
                    reportData.length != 0 && (
                      <>
                        <table className='reportTable'>
                          <thead>
                            <tr>
                              <th>CLASS</th>
                              <th>REGULAR</th>
                              <th>SUBSTITUTION</th>
                              <th>TOTAL</th>
                            </tr>

                          </thead>
                          <tbody>
                            {reportData.map((period) => {
                              return (
                                <tr key={period.class}>
                                  <td>{period.class}</td>
                                  <td>{period.regular}</td>
                                  <td>{period.substitution}</td>
                                  <td>{period.total}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </>
                    )
                  }
                </div>
              </div>
            </>
          )}
          {currPage === 'enterAttendance' && !enteredToday && (
            <>
              {!enteredToday && (
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
                          <button onClick={handleNo} className='noBtn'>No</button>
                          <button onClick={handleYes} className='okayBtn'>Okay</button>
                        </div>
                      </div>

                    )}
                  </div>
                </div>
              )}

            </>
          )}
          {enteredToday && currPage === 'enterAttendance' && (
            <>
              <p>Completed todays Attendance entry</p>
              <a href="/">Enter Again</a>
            </>
          )}


        </div>
      </main>
    </div>
  );
}

export default Home;