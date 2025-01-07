import React from 'react';
import '../home.css';

const MobileNav = ({ currPage, handlePageChange }) => {
    return (
        <div className="mobileNav">
            <button 
                onClick={() => handlePageChange('enterAttendance')} 
                className={currPage === 'enterAttendance' ? 'navButtons activeNavBtn' : 'navButtons'}
            >
                Enter Attendance
            </button>
            <button 
                onClick={() => handlePageChange('reports')} 
                className={currPage === 'reports' ? 'navButtons activeNavBtn' : 'navButtons'}
            >
                Reports
            </button>
        </div>
    );
};

export default MobileNav;
