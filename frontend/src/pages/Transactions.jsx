import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Trash2, Edit2 } from 'lucide-react';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [editingId, setEditingId] = useState(null);

    const categories = {
        expense: ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Other'],
        income: ['Salary', 'Freelance', 'Investments', 'Gift', 'Other']
    };

    const fetchTransactions = async () => {
        try {
            const res = await api.get('/api/transactions');
            setTransactions(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/api/transactions/${editingId}`, formData);
            } else {
                await api.post('/api/transactions', formData);
            }
            setShowModal(false);
            setEditingId(null);
            setFormData({
                title: '',
                amount: '',
                type: 'expense',
                category: '',
                date: new Date().toISOString().split('T')[0]
            });
            fetchTransactions();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (transaction) => {
        setFormData({
            title: transaction.title,
            amount: transaction.amount,
            type: transaction.type,
            category: transaction.category,
            date: new Date(transaction.date).toISOString().split('T')[0]
        });
        setEditingId(transaction._id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await api.delete(`/api/transactions/${id}`);
                fetchTransactions();
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (loading) return <div>Loading transactions...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Transactions</h1>
                    <p style={styles.subtitle}>Manage your income and expenses</p>
                </div>
                <button className="btn btn-primary" onClick={() => {
                    setEditingId(null);
                    setFormData({
                        title: '',
                        amount: '',
                        type: 'expense',
                        category: '',
                        date: new Date().toISOString().split('T')[0]
                    });
                    setShowModal(true);
                }}>
                    <Plus size={20} /> Add Transaction
                </button>
            </div>

            <div className="glass-panel" style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Title</th>
                            <th style={styles.th}>Category</th>
                            <th style={styles.th}>Amount</th>
                            <th style={{...styles.th, textAlign: 'right'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(t => (
                            <tr key={t._id} style={styles.tr}>
                                <td style={styles.td}>{new Date(t.date).toLocaleDateString()}</td>
                                <td style={styles.td}>
                                    <span style={styles.rowTitle}>{t.title}</span>
                                </td>
                                <td style={styles.td}>
                                    <span style={styles.categoryBadge}>{t.category}</span>
                                </td>
                                <td style={{
                                    ...styles.td, 
                                    color: t.type === 'income' ? '#10b981' : '#ef4444',
                                    fontWeight: '600'
                                }}>
                                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                </td>
                                <td style={{...styles.td, textAlign: 'right'}}>
                                    <button onClick={() => handleEdit(t)} style={styles.iconBtn} className="edit-btn">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(t._id)} style={{...styles.iconBtn, color: '#ef4444'}} className="delete-btn">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {transactions.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                        No transactions found. Click 'Add Transaction' to get started.
                    </div>
                )}
            </div>

            {showModal && (
                <div style={styles.modalOverlay}>
                    <div className="glass-panel" style={styles.modal}>
                        <h2 style={{marginBottom: '20px'}}>{editingId ? 'Edit Transaction' : 'Add Transaction'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Type</label>
                                <select 
                                    name="type" 
                                    className="form-input" 
                                    value={formData.type} 
                                    onChange={handleChange}
                                >
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input 
                                    type="text" 
                                    name="title" 
                                    className="form-input" 
                                    value={formData.title} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Amount</label>
                                <input 
                                    type="number" 
                                    name="amount" 
                                    step="0.01"
                                    className="form-input" 
                                    value={formData.amount} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select 
                                    name="category" 
                                    className="form-input" 
                                    value={formData.category} 
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select category</option>
                                    {categories[formData.type].map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input 
                                    type="date" 
                                    name="date" 
                                    className="form-input" 
                                    value={formData.date} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                                <button type="button" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }} onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingId ? 'Save Changes' : 'Add Transaction'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        width: '100%'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
    },
    title: {
        fontSize: '28px',
        marginBottom: '8px'
    },
    subtitle: {
        color: '#94a3b8'
    },
    tableContainer: {
        padding: '24px',
        overflowX: 'auto'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    th: {
        textAlign: 'left',
        padding: '16px',
        color: '#94a3b8',
        fontWeight: '500',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    tr: {
        transition: 'background 0.2s',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
    },
    td: {
        padding: '16px',
        color: '#f8fafc'
    },
    rowTitle: {
        fontWeight: '500'
    },
    categoryBadge: {
        background: 'rgba(59, 130, 246, 0.1)',
        color: '#3b82f6',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500'
    },
    iconBtn: {
        background: 'none',
        border: 'none',
        color: '#94a3b8',
        cursor: 'pointer',
        padding: '6px',
        marginLeft: '8px',
        borderRadius: '6px',
        transition: 'all 0.2s'
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
    modal: {
        width: '100%',
        maxWidth: '500px',
        padding: '32px'
    }
};

export default Transactions;
