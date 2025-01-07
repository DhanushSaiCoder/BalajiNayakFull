import React from 'react';
import '../home.css';

const MobileNav = ({ currPage, handlePageChange }) => {
    return (
        <div className="mobileNav">
            <button
                onClick={() => handlePageChange('enterAttendance')}
                className={currPage === 'enterAttendance' ? 'mobileNavButtons activeNavBtn' : 'mobileNavButtons'}
            >
                Enter Attendance
            </button>
            <button
                onClick={() => handlePageChange('reports')}
                className={currPage === 'reports' ? 'mobileNavButtons activeNavBtn' : 'mobileNavButtons'}
            >
                Reports
            </button>
            <button
                onClick={() => {
                    localStorage.removeItem('BNtoken')
                    window.location.href = '/login'
                }}
                // className={currPage === 'reports' ? 'mobileNavButtons activeNavBtn' : 'mobileNavButtons'}
                className='mobileNavButtons'
                id='mobileLogOutBtn'
            >
                Log Out
            </button>
        </div>
    );
};

export default MobileNav;
