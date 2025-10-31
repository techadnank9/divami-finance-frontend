import React, { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button, Box,
  IconButton, Table, TableHead, TableRow, TableCell, TableBody, MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { budgets } from '../services/pf';
import Layout from '../components/Layout';
import { formatCurrency } from '../utils/fomat';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Budgets() {
  const [rows, setRows] = useState<any[]>([]);
  const [category, setCategory] = useState('Food');
  const [limit, setLimit] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await budgets.list({ year, month });
      setRows(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [year, month]);

  const add = async () => {
    if (!category || !limit) return;
    try {
      await budgets.create({ category, limitAmount: Number(limit), month, year });
      setLimit('');
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const remove = async (id: string) => {
    try {
      await budgets.del(id);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout title="Budgets">
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
          <Typography variant="h5">Budgets</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Category"
            value={category}
            onChange={e => setCategory(e.target.value)}
          />
          <TextField
            label="Limit"
            value={limit}
            onChange={e => setLimit(e.target.value)}
            type="number"
          />

          {/* ▼ Updated: month dropdown with month names */}
          <TextField
            select
            label="Month"
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
            sx={{ minWidth: 160 }}
          >
            {MONTHS.map((name, index) => (
              <MenuItem key={name} value={index + 1}>
                {name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Year"
            type="number"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
          />
          <Button variant="contained" onClick={add}>Add</Button>
        </Box>

        <Table sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Limit</TableCell>
              <TableCell>Month</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(r => (
              <TableRow key={r._id}>
                <TableCell>{r.category}</TableCell>
                <TableCell>{formatCurrency(r.limitAmount)}</TableCell>
                {/* ▼ Month name shown instead of number */}
                <TableCell>{MONTHS[(r.month || 1) - 1]}</TableCell>
                <TableCell>{r.year}</TableCell>
                <TableCell>
                  <IconButton aria-label="edit"><EditIcon /></IconButton>
                  <IconButton aria-label="delete" onClick={() => remove(r._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography align="center" sx={{ py: 3 }}>No budgets yet</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Container>
    </Layout>
  );
}
