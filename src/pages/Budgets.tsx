import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Box, IconButton, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { budgets } from '../services/pf';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Layout from '../components/Layout';

export default function Budgets() {
  const [rows, setRows] = useState<any[]>([]);
  const [category, setCategory] = useState('Food');
  const [limit, setLimit] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const load = async () => {
    const data = await budgets.list({ year, month });
    setRows(data || []);
  };

  useEffect(() => { load() }, [year, month]);

  const add = async () => {
    await budgets.create({ category, limitAmount: Number(limit), month, year });
    setLimit(''); load();
  };

  const remove = async (id: string) => {
    await budgets.del(id); load();
  };

  return (
    <Layout title="Budgets">
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
          <Typography variant="h5">Budgets</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField label="Category" value={category} onChange={e => setCategory(e.target.value)} />
          <TextField label="Limit" value={limit} onChange={e => setLimit(e.target.value)} />
          <TextField label="Month" type="number" value={month} onChange={e => setMonth(Number(e.target.value))} />
          <TextField label="Year" type="number" value={year} onChange={e => setYear(Number(e.target.value))} />
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
                <TableCell>{r.limitAmount}</TableCell>
                <TableCell>{r.month}</TableCell>
                <TableCell>{r.year}</TableCell>
                <TableCell>
                  <IconButton><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(r._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </Layout>
  );
}
