// src/pages/AddTransaction.tsx
import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { tx } from '../services/pf';
import dayjs from 'dayjs';
import { formatCurrency } from '../utils/fomat';

const defaultCategories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Salary', 'Other'];

const schema = yup.object({
  amount: yup.number().typeError('Amount must be a number').positive('Amount must be > 0').required('Amount is required'),
  type: yup.string().oneOf(['income', 'expense']).required(),
  category: yup.string().required('Category required'),
  note: yup.string().max(500).nullable(),
  date: yup.string().required('Date required'), // keep date as ISO string in the form
}).required();

type FormValues = {
  amount: number | string;
  type: 'income' | 'expense';
  category: string;
  note?: string | null;
  date: string;
};

export default function AddTransaction({ open = true, onClose, onSaved, transaction }: any) {
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      amount: transaction?.amount ?? '',
      type: (transaction?.type as 'income' | 'expense') ?? 'expense',
      category: transaction?.category ?? 'Other',
      note: transaction?.note ?? '',
      date: transaction ? dayjs(transaction.date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
    },
  });

  useEffect(() => {
    reset({
      amount: transaction?.amount ?? '',
      type: (transaction?.type as 'income' | 'expense') ?? 'expense',
      category: transaction?.category ?? 'Other',
      note: transaction?.note ?? '',
      date: transaction ? dayjs(transaction.date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
    });
  }, [transaction, reset]);

  const onSubmit = async (data: FormValues) => {
    const payload = { ...data, amount: Number(data.amount), date: new Date(data.date) };
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
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 380 }}>
        <Controller
          name="amount"
          control={control}
          render={({ field }) => <TextField label="Amount" value={field.value} onChange={(e) => field.onChange(e.target.value)} helperText={errors.amount?.message} error={!!errors.amount} />}
        />
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <TextField select label="Type" value={field.value} onChange={field.onChange}>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </TextField>
          )}
        />
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <TextField select label="Category" value={field.value} onChange={field.onChange}>
              {defaultCategories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          )}
        />
        <Controller
          name="date"
          control={control}
          render={({ field }) => <TextField label="Date" type="date" value={field.value} onChange={field.onChange} InputLabelProps={{ shrink: true }} />}
        />
        <Controller
          name="note"
          control={control}
          render={({ field }) => <TextField label="Note" value={field.value} onChange={field.onChange} multiline minRows={2} />}
        />
        <div style={{ color: '#666', fontSize: 12 }}>
          Preview: {formatCurrency(Number((control as any)?._formValues?.amount || 0))}
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
