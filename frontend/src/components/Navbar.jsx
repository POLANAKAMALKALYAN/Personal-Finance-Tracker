import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Receipt, PieChart, LogOut } from 'lucide-react';

const Navbar = () => {
    const { logout, user } = useContext(AuthContext);
    const location = useLocation();

    return (
        <nav style={styles.sidebar}>
            <div style={styles.logoContainer}>
                <div style={styles.logoIcon}>$</div>
                <h2 style={styles.logoText}>Finance Tracker</h2>
            </div>
            
            <div style={styles.userSection}>
                <p style={styles.userName}>Hello, {user?.name}</p>
            </div>

            <ul style={styles.navList}>
                <li style={styles.navItem}>
                    <Link to="/" style={location.pathname === '/' ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}>
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                </li>
                <li style={styles.navItem}>
                    <Link to="/transactions" style={location.pathname === '/transactions' ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}>
                        <Receipt size={20} />
                        Transactions
                    </Link>
                </li>
                <li style={styles.navItem}>
                    <Link to="/reports" style={location.pathname === '/reports' ? { ...styles.navLink, ...styles.navLinkActive } : styles.navLink}>
                        <PieChart size={20} />
                        Reports
                    </Link>
                </li>
            </ul>

            <div style={styles.bottomSection}>
                <button onClick={logout} className="btn" style={styles.logoutBtn}>
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </nav>
    );
};

const styles = {
    sidebar: {
        width: '250px',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        zIndex: 100
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '40px'
    },
    logoIcon: {
        background: 'linear-gradient(135deg, #3b82f6, #10b981)',
        color: 'white',
        width: '40px',
        height: '40px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '20px'
    },
    logoText: {
        fontSize: '18px',
        margin: 0,
        background: 'linear-gradient(to right, #fff, #94a3b8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    userSection: {
        marginBottom: '32px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    userName: {
        color: '#f8fafc',
        fontWeight: '500'
    },
    navList: {
        listStyle: 'none',
        padding: 0,
        flex: 1
    },
    navItem: {
        marginBottom: '8px'
    },
    navLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: '#94a3b8',
        textDecoration: 'none',
        padding: '12px 16px',
        borderRadius: '8px',
        transition: 'all 0.2s'
    },
    navLinkActive: {
        background: 'rgba(59, 130, 246, 0.15)',
        color: '#3b82f6',
    },
    bottomSection: {
        marginTop: 'auto'
    },
    logoutBtn: {
        width: '100%',
        background: 'transparent',
        color: '#ef4444',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        justifyContent: 'flex-start'
    }
};

export default Navbar;
