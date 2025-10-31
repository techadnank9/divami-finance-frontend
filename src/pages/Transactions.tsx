import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, IconButton, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { tx } from '../services/pf';
import AddTransaction from './AddTransaction';
import dayjs from 'dayjs';

export default function Transactions() {
  const [items, setItems] = useState<any[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const load = async () => {
    try {
      const data = await tx.list();
      setItems(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { load() }, []);

  const remove = async (id: string) => {
    await tx.del(id);
    load();
  };

  const onSaved = () => { setOpenAdd(false); setEditing(null); load() };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Typography variant="h5">Transactions</Typography>
        <Button variant="contained" onClick={() => setOpenAdd(true)}>Add</Button>
      </Box>

      <Table sx={{ mt: 2 }}>
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
          {items.map(it => (
            <TableRow key={it._id}>
              <TableCell>{dayjs(it.date).format('YYYY-MM-DD')}</TableCell>
              <TableCell>{it.amount}</TableCell>
              <TableCell>{it.type}</TableCell>
              <TableCell>{it.category}</TableCell>
              <TableCell>{it.note}</TableCell>
              <TableCell>
                <IconButton onClick={() => setEditing(it)}><EditIcon /></IconButton>
                <IconButton onClick={() => remove(it._id)}><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {openAdd && <AddTransaction open onClose={() => setOpenAdd(false)} onSaved={onSaved} />}
      {editing && <AddTransaction open transaction={editing} onClose={() => setEditing(null)} onSaved={onSaved} />}
    </Container>
  );
}
