import React from 'react';
import Layout from '../components/Layout';
import TransactionsList from './TransactionsListWrapper';

export default function Transactions() {
  return (
    <Layout title="Transactions">
      <TransactionsList />
    </Layout>
  );
}
