import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import '../../css/admin/adminDashboard.css';
import axios from 'axios';

Chart.register(...registerables);

// Custom Hook for the count-up animation
const useCountUp = (targetValue, duration) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = targetValue / (duration / 16); // approximate frame rate of 60fps (16ms per frame)
        const animate = () => {
            start += increment;
            if (start < targetValue) {
                setCount(Math.floor(start));
                requestAnimationFrame(animate);
            } else {
                setCount(targetValue); // ensure we end on the target value
            }
        };
        animate();
    }, [targetValue, duration]);

    return count;
};

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        totalSales: 0,
        monthlySales: [],
        latestMonthSale: 0,
    });

    const [orderStatusData, setOrderStatusData] = useState({
        completedOrders: 0,
        canceledOrders: 0,
        pendingOrders: 0,
    });

    const [salesPerMonthData, setSalesPerMonthData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Sales (in currency)',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    });

    const [ordersPerMonthData, setOrdersPerMonthData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Number of Orders',
                data: [],
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        axios.get('/order-stats').then((response) => {
            setStats((prevStats) => ({
                ...prevStats,
                totalOrders: response.data.totalOrders,
                pendingOrders: response.data.pendingOrders,
                totalSales: response.data.totalSales,
            }));
        });

        axios.get('/sales-per-month').then((response) => {
            const sales = response.data;

            const labels = sales.map((sale) => `${sale.month}-${sale.year}`);
            const salesData = sales.map((sale) => sale.totalSales);
            const ordersData = sales.map((sale) => sale.numberOfOrders);
            const lastMonthSale = sales[sales.length - 1]?.totalSales;

            setStats((prevStats) => ({
                ...prevStats,
                latestMonthSale: lastMonthSale,
            }));

            setSalesPerMonthData({
                labels,
                datasets: [
                    {
                        label: 'Sales (in PKR)',
                        data: salesData,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                ],
            });

            setOrdersPerMonthData({
                labels,
                datasets: [
                    {
                        label: 'Number of Orders',
                        data: ordersData,
                        backgroundColor: 'rgba(153, 102, 255, 0.6)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1,
                    },
                ],
            });
        });

        axios.get('/order-status-stats').then((response) => {
            setOrderStatusData({
                completedOrders: response.data.completedOrders,
                canceledOrders: response.data.canceledOrders,
                pendingOrders: response.data.pendingOrders,
            });
        });
    }, []);

    const dataDoughnut = {
        labels: ['Completed Orders', 'Canceled Orders', 'Pending Orders'],
        datasets: [
            {
                data: [
                    orderStatusData.completedOrders,
                    orderStatusData.canceledOrders,
                    orderStatusData.pendingOrders,
                ],
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
            },
        ],
    };

    // Animated numbers in the dashboard boxes
    const animatedTotalOrders = useCountUp(stats.totalOrders, 1000); // 2 seconds duration
    const animatedPendingOrders = useCountUp(stats.pendingOrders, 1000); 
    const animatedTotalSales = useCountUp(stats.totalSales, 2000); 
    const animatedLatestMonthSale = useCountUp(stats.latestMonthSale, 2000); 

    return (
        <div className="admin-dashboard">
            <h1>Dashboard</h1>
            <div className="admin-dashboard-boxes">
                <div className="admin-dashboard-box">
                    <h2>{animatedTotalOrders}</h2>
                    <p>Total Orders</p>
                </div>
                <div className="admin-dashboard-box">
                    <h2>{animatedPendingOrders}</h2>
                    <p>Pending Orders</p>
                </div>
                <div className="admin-dashboard-box">
                    <h2>RS. {animatedTotalSales}</h2>
                    <p>Total Sale</p>
                </div>
                <div className="admin-dashboard-box">
                    <h2>RS. {animatedLatestMonthSale}</h2>
                    <p>Last Month Sale</p>
                </div>
            </div>
            <div className="admin-dashboard-graphs">
                <div className="admin-dashboard-graph">
                    <h2>Sales Per Month</h2>
                    <Bar id="salesBarChart" data={salesPerMonthData} />
                </div>
                <div className="admin-dashboard-graph">
                    <h2>Orders Per Month</h2>
                    <Bar id="ordersBarChart" data={ordersPerMonthData} />
                </div>
                <div className="admin-dashboard-graph">
                    <h2>Order Status Breakdown</h2>
                    <Doughnut id="doughnutChart" data={dataDoughnut} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
