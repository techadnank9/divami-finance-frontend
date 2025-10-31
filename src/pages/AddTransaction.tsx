import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem } from '@mui/material';
import { tx } from '../services/pf';
import dayjs from 'dayjs';

const defaultCategories = ['Food','Transport','Entertainment','Bills','Salary','Other'];

export default function AddTransaction({ open=true, onClose, onSaved, transaction }: any) {
  const [amount, setAmount] = useState(transaction?.amount ?? '');
  const [type, setType] = useState(transaction?.type ?? 'expense');
  const [category, setCategory] = useState(transaction?.category ?? 'Other');
  const [note, setNote] = useState(transaction?.note ?? '');
  const [date, setDate] = useState(transaction ? dayjs(transaction.date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));

  useEffect(()=> {
    if(transaction) {
      setAmount(transaction.amount);
      setType(transaction.type);
      setCategory(transaction.category || 'Other');
      setNote(transaction.note || '');
      setDate(dayjs(transaction.date).format('YYYY-MM-DD'));
    }
  }, [transaction]);

  const submit = async () => {
    const payload = { amount: Number(amount), type, category, note, date: new Date(date) };
    try {
      if (transaction) {
        await tx.update(transaction._id, payload);
      } else {
        await tx.create(payload);
      }
      onSaved && onSaved();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{transaction ? 'Edit' : 'Add'} Transaction</DialogTitle>
      <DialogContent sx={{ display:'flex', flexDirection:'column', gap:2, minWidth:360 }}>
        <TextField label="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
        <TextField select label="Type" value={type} onChange={e=>setType(e.target.value)}>
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </TextField>
        <TextField select label="Category" value={category} onChange={e=>setCategory(e.target.value)}>
          {defaultCategories.map(c=> <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </TextField>
        <TextField label="Date" type="date" value={date} onChange={e=>setDate(e.target.value)} InputLabelProps={{ shrink:true }} />
        <TextField label="Note" value={note} onChange={e=>setNote(e.target.value)} multiline />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
