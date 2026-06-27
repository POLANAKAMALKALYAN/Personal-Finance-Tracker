import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const Reports = () => {
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

    if (loading) return <div>Loading reports...</div>;

    // Process data for charts
    // Group by month
    const monthlyData = transactions.reduce((acc, curr) => {
        const date = new Date(curr.date);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        
        if (!acc[monthYear]) {
            acc[monthYear] = { name: monthYear, income: 0, expense: 0 };
        }
        
        if (curr.type === 'income') {
            acc[monthYear].income += curr.amount;
        } else {
            acc[monthYear].expense += curr.amount;
        }
        
        return acc;
    }, {});

    // Sort chronologically for the chart
    const barData = Object.values(monthlyData).sort((a, b) => {
        return new Date(a.name) - new Date(b.name);
    });

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Financial Reports</h1>
                <p style={styles.subtitle}>Analyze your spending and income trends over time</p>
            </header>

            <div style={styles.grid}>
                <div className="glass-panel" style={styles.card}>
                    <h3 style={styles.sectionTitle}>Income vs Expense (Monthly)</h3>
                    {barData.length > 0 ? (
                        <div style={{ height: '400px', marginTop: '20px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={barData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="name" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                                    <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>No data available for reports.</p>
                    )}
                </div>

                <div className="glass-panel" style={styles.card}>
                    <h3 style={styles.sectionTitle}>Cash Flow Trend</h3>
                    {barData.length > 0 ? (
                        <div style={{ height: '400px', marginTop: '20px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={barData.map(d => ({...d, balance: d.income - d.expense}))}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="name" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} name="Net Balance" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>No data available for reports.</p>
                    )}
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
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '24px'
    },
    card: {
        padding: '24px'
    },
    sectionTitle: {
        fontSize: '18px',
        margin: 0
    }
};

export default Reports;
