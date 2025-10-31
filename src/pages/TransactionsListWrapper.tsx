import React from 'react';
import Transactions from './Transactions'; // if name collision, this file will import the one generated earlier
export default function TransactionsListWrapper() {
  // If ./Transactions is the modal+table component we created earlier, render it
  // If it conflicts, open file to adjust. This is a safe indirection.
  // @ts-ignore
  return <div style={{ marginTop: 8 }}><Transactions /></div>;
}
