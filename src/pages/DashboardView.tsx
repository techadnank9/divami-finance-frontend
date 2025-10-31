import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  LinearProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid
} from '@mui/material';
import { tx, budgets } from '../services/pf';
import dayjs from 'dayjs';
import { formatCurrency } from '../utils/fomat';

export default function DashboardView() {
  const [income, setIncome] = useState<number>(0);
  const [expense, setExpense] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);
  const [byCategory, setByCategory] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);

  const now = dayjs();
  const year = now.year();
  const month = now.month() + 1;

  const load = async () => {
    try {
      const list = await tx.list({
        from: new Date(year, month - 1, 1).toISOString(),
        to: new Date(year, month, 0, 23, 59, 59).toISOString(),
      });
      const arr = list || [];
      let inc = 0, exp = 0;
      arr.forEach((t: any) => t.type === 'income' ? (inc += Number(t.amount)) : (exp += Number(t.amount)));
      setIncome(inc);
      setExpense(exp);
      setBalance(inc - exp);
      setRecent(arr.slice(0, 6));

      // try server endpoint first, fallback to client aggregate
      const cat = await tx.byCategory(year, month);
      if (cat && Array.isArray(cat) && cat.length) {
        setByCategory(cat);
      } else {
        const map: Record<string, number> = {};
        arr.forEach((t: any) => { map[t.category] = (map[t.category] || 0) + Number(t.amount); });
        setByCategory(Object.entries(map).map(([k, v]) => ({ _id: k, total: v })));
      }

      const b = await budgets.list({ year, month });
      let totalLimit = 0;
      (b || []).forEach((r: any) => totalLimit += Number(r.limitAmount || 0));
      setRemaining(totalLimit - exp);
    } catch (e) {
      console.error('Dashboard load error', e);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Total Income (This Month)</Typography>
            <Typography variant="h5" sx={{ mt: 1 }}>{formatCurrency(income)}</Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Total Expense (This Month)</Typography>
            <Typography variant="h5" sx={{ mt: 1 }}>{expense}</Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Balance</Typography>
            <Typography variant="h5" sx={{ mt: 1 }}>{formatCurrency(balance)}</Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Remaining Budget</Typography>
            <Typography variant="h5" sx={{ mt: 1 }}>{remaining}</Typography>
          </Paper>
        </Grid>


        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Spending by Category</Typography>
            {byCategory.length === 0 && <Typography sx={{ mt: 1 }}>No data</Typography>}
            {byCategory.map((b: any) => {
              // simple percentage for progress bar (not relative to budget)
              const pct = b.total ? Math.min(100, (b.total / Math.max(1, (b.total + 100))) * 100) : 0;
              return (
                <Box key={b._id} sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>{b._id} — {b.total}</Typography>
                  <LinearProgress variant="determinate" value={pct} />
                </Box>
              );
            })}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Recent Transactions</Typography>
            <Table size="small" sx={{ mt: 1 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Note</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recent.map((r: any) => (
                  <TableRow key={r._id}>
                    <TableCell>{dayjs(r.date).format('YYYY-MM-DD')}</TableCell>
                    <TableCell>{r.amount}</TableCell>
                    <TableCell>{r.type}</TableCell>
                    <TableCell>{r.category}</TableCell>
                    <TableCell>{r.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
