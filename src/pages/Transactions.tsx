import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, IconButton, Table, TableHead, TableRow, TableCell, TableBody, Button, TablePagination, Paper, TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { tx } from '../services/pf';
import AddTransaction from './AddTransaction';
import dayjs from 'dayjs';
import Layout from '../components/Layout';
import { formatCurrency } from '../utils/fomat';

export default function Transactions() {
  const [items, setItems] = useState<any[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // pagination state (client-side)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // filters
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [appliedFrom, setAppliedFrom] = useState<string | null>(null);
  const [appliedTo, setAppliedTo] = useState<string | null>(null);

  const load = async (opts: { from?: string | null; to?: string | null } = {}) => {
    setLoading(true);
    try {
      // pass filters directly to API if provided
      const params: any = {};
      if (opts.from) params.from = opts.from;
      if (opts.to) params.to = opts.to;
      const data = await tx.list(params);
      setItems(data || []);
      setPage(0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    try {
      await tx.del(id);
      await load({ from: appliedFrom || undefined, to: appliedTo || undefined });
    } catch (e) {
      console.error(e);
    }
  };

  const onSaved = async () => { setOpenAdd(false); setEditing(null); await load({ from: appliedFrom || undefined, to: appliedTo || undefined }); };

  // page handlers
  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  // apply/reset filters
  const applyFilters = () => {
    const f = fromDate ? new Date(fromDate).toISOString() : undefined;
    // include end-of-day for 'to' so inclusive
    const t = toDate ? new Date(new Date(toDate).setHours(23, 59, 59, 999)).toISOString() : undefined;
    setAppliedFrom(f || null);
    setAppliedTo(t || null);
    load({ from: f || null, to: t || null });
  };

  const resetFilters = () => {
    setFromDate('');
    setToDate('');
    setAppliedFrom(null);
    setAppliedTo(null);
    load();
  };

  // slice visible rows
  const visible = items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Layout title="Transactions">
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
          <Typography variant="h5">Transactions</Typography>
          <Button variant="contained" onClick={() => setOpenAdd(true)}>Add</Button>
        </Box>

        {/* Filters */}
        <Paper sx={{ mt: 2, p: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              label="From"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              sx={{ width: 200 }}
            />
            <TextField
              label="To"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              sx={{ width: 200 }}
            />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" onClick={applyFilters}>Apply</Button>
              <Button onClick={resetFilters}>Reset</Button>
            </Box>

            <Box sx={{ flex: 1 }} />

            <Box sx={{ fontSize: 13, color: 'text.secondary' }}>
              {appliedFrom && <span>Filtered from: {dayjs(appliedFrom).format('YYYY-MM-DD')} </span>}
              {appliedTo && <span>to {dayjs(appliedTo).format('YYYY-MM-DD')}</span>}
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Note</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visible.map(it => (
                <TableRow key={it._id}>
                  <TableCell>{dayjs(it.date).format('YYYY-MM-DD')}</TableCell>
                  <TableCell>{formatCurrency(it.amount)}</TableCell>
                  <TableCell>{it.type}</TableCell>
                  <TableCell>{it.category}</TableCell>
                  <TableCell>{it.note}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => setEditing(it)} aria-label="edit"><EditIcon /></IconButton>
                    <IconButton onClick={() => remove(it._id)} aria-label="delete"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography align="center" sx={{ py: 3 }}>No transactions</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={items.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>

        {openAdd && <AddTransaction open onClose={() => setOpenAdd(false)} onSaved={onSaved} />}
        {editing && <AddTransaction open transaction={editing} onClose={() => setEditing(null)} onSaved={onSaved} />}
      </Container>
    </Layout>
  );
}
