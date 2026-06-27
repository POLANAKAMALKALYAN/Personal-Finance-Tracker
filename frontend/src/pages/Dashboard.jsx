import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        fetchTransactions();
    }, []);

    // Calculate totals
    const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const balance = income - expenses;

    // Calculate expense categories for pie chart
    const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

    const pieData = Object.keys(expensesByCategory).map((key, index) => ({
        name: key,
        value: expensesByCategory[key]
    }));

    const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'];

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Financial Overview</h1>
                <p style={styles.subtitle}>Here's a summary of your current financial status</p>
            </header>

            <div style={styles.summaryGrid}>
                <div className="glass-panel" style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>Total Balance</h3>
                        <div style={{ ...styles.iconWrapper, background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
                            <Wallet size={24} />
                        </div>
                    </div>
                    <h2 style={styles.cardAmount}>${balance.toFixed(2)}</h2>
                </div>

                <div className="glass-panel" style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>Total Income</h3>
                        <div style={{ ...styles.iconWrapper, background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <h2 style={{ ...styles.cardAmount, color: '#10b981' }}>+${income.toFixed(2)}</h2>
                </div>

                <div className="glass-panel" style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>Total Expenses</h3>
                        <div style={{ ...styles.iconWrapper, background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
                            <TrendingDown size={24} />
                        </div>
                    </div>
                    <h2 style={{ ...styles.cardAmount, color: '#ef4444' }}>-${expenses.toFixed(2)}</h2>
                </div>
            </div>

            <div style={styles.mainGrid}>
                <div className="glass-panel" style={styles.chartCard}>
                    <h3 style={styles.sectionTitle}>Expenses by Category</h3>
                    {pieData.length > 0 ? (
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '40px' }}>No expenses recorded yet.</p>
                    )}
                </div>

                <div className="glass-panel" style={styles.recentCard}>
                    <div style={styles.recentHeader}>
                        <h3 style={styles.sectionTitle}>Recent Transactions</h3>
                    </div>
                    <div style={styles.transactionList}>
                        {transactions.slice(0, 5).map(t => (
                            <div key={t._id} style={styles.transactionItem}>
                                <div style={styles.transactionInfo}>
                                    <div style={{
                                        ...styles.transactionIcon,
                                        background: t.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: t.type === 'income' ? '#10b981' : '#ef4444'
                                    }}>
                                        {t.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                    </div>
                                    <div>
                                        <p style={styles.transactionTitle}>{t.title}</p>
                                        <p style={styles.transactionDate}>{new Date(t.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span style={{
                                    fontWeight: '600',
                                    color: t.type === 'income' ? '#10b981' : '#ef4444'
                                }}>
                                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                </span>
                            </div>
                        ))}
                        {transactions.length === 0 && (
                            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0' }}>No transactions found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        width: '100%'
    },
    header: {
        marginBottom: '32px'
    },
    title: {
        fontSize: '28px',
        marginBottom: '8px'
    },
    subtitle: {
        color: '#94a3b8'
    },
    summaryGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
    },
    card: {
        padding: '24px'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
    },
    cardTitle: {
        fontSize: '16px',
        color: '#94a3b8',
        margin: 0,
        fontWeight: '500'
    },
    iconWrapper: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardAmount: {
        fontSize: '32px',
        margin: 0
    },
    mainGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
    },
    chartCard: {
        padding: '24px',
        minHeight: '400px'
    },
    recentCard: {
        padding: '24px',
        minHeight: '400px'
    },
    sectionTitle: {
        fontSize: '18px',
        marginBottom: '20px'
    },
    recentHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    transactionList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    transactionItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        background: 'rgba(15, 23, 42, 0.4)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
    },
    transactionInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    transactionIcon: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    transactionTitle: {
        color: '#f8fafc',
        fontWeight: '500',
        marginBottom: '4px'
    },
    transactionDate: {
        color: '#94a3b8',
        fontSize: '12px',
        margin: 0
    }
};

export default Dashboard;
