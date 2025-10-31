import React from 'react';
import Layout from '../components/Layout';
import BudgetsList from './BudgetsListWrapper';

export default function Budgets() {
  return (
    <Layout title="Budgets">
      <BudgetsList />
    </Layout>
  );
}
