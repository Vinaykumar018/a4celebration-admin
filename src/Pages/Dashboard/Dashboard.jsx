import React from 'react';
import { DashboardOverview } from './DashboardOverview';
import { ServicesStats } from './ServicesStats';
import { EcommerceStats } from './EcommerceStats';

function Dashboard() {
  // Mock data
  const stats = {
    totalOrders: 1245,
    totalRevenue: '$48,245',
    todayRevenue: '$1,250',
    totalUsers: 845,
    totalServices: 28,
    orderStatus: {
      pending: 42,
      processing: 18,
      completed: 1150,
      cancelled: 35
    },
    orderStatusPercentage: {
      pending: 3.4,
      processing: 1.4,
      completed: 92.4,
      cancelled: 2.8
    },
    latestOrders: [
      { id: '#ORD-001', customer: 'John Doe', amount: '$120', status: 'Processing' },
      { id: '#ORD-002', customer: 'Jane Smith', amount: '$85', status: 'Shipped' },
      { id: '#ORD-003', customer: 'Robert Johnson', amount: '$230', status: 'Delivered' },
    ],
    todayBookings: [
      { id: '#BK-101', service: 'Wedding Puja', time: '10:00 AM', status: 'Confirmed' },
      { id: '#BK-102', service: 'Griha Pravesh', time: '02:30 PM', status: 'Pending' },
    ]
  };

  return (
    <div className="p-4">
      <DashboardOverview stats={stats} />
      <ServicesStats stats={stats} />
      <EcommerceStats stats={stats} />
    </div>
  );
}

export default Dashboard;