import React from 'react';
import Layout from '../components/Layout';
import DashboardView from './DashboardView';

export default function Dashboard() {
  return (
    <Layout title="Dashboard">
      <DashboardView />
    </Layout>
  );
}
