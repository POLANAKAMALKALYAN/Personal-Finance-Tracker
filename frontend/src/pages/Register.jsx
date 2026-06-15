import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Register = () => {
    const { register } = useContext(AuthContext);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div style={styles.container}>
            <div className="glass-panel" style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.icon}>$</div>
                    <h2>Create Account</h2>
                    <p>Start tracking your finances today</p>
                </div>
                
                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            className="form-input" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            className="form-input" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            className="form-input" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Sign Up
                    </button>
                </form>
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p>Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link></p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%'
    },
    card: {
        width: '100%',
        maxWidth: '400px',
        padding: '40px'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px'
    },
    icon: {
        background: 'linear-gradient(135deg, #3b82f6, #10b981)',
        color: 'white',
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '28px',
        margin: '0 auto 20px auto'
    },
    error: {
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
        border: '1px solid rgba(239, 68, 68, 0.2)'
    }
};

export default Register;
