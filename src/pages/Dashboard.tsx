import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, LinearProgress, Paper } from '@mui/material';
import { tx, budgets } from '../services/pf';
import dayjs from 'dayjs';

export default function Dashboard() {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [byCategory, setByCategory] = useState<any[]>([]);
  const now = dayjs();
  const year = now.year();
  const month = now.month() + 1;

  const load = async () => {
    try {
      // use endpoints; backend provides sumByUserAndMonth and sumByCategory via tx routes if implemented
      const cat = await tx.byCategory(year, month);
      setByCategory(cat || []);
      // simple totals by fetching transactions and summing client-side if backend summary endpoints missing
      const list = await tx.list({ from: new Date(year, month-1, 1).toISOString(), to: new Date(year, month, 0,23,59,59).toISOString() });
      let inc=0, exp=0;
      (list||[]).forEach((t:any)=> { if(t.type==='income') inc+=t.amount; else exp+=t.amount; });
      setIncome(inc); setExpense(exp);

      const b = await budgets.list({ year, month });
      // calculate remaining: sum(budget limits) - sum(spent for those categories)
      let totalLimit = 0;
      b.forEach((r:any)=> totalLimit += r.limitAmount);
      setRemaining(totalLimit - exp);
    } catch(e){ console.error(e); }
  };

  useEffect(()=>{ load() },[]);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt:3 }}>Dashboard</Typography>
      <Box sx={{ display:'flex', gap:2, mt:2 }}>
        <Paper sx={{ p:2, width:200 }}>
          <Typography>Total Income</Typography>
          <Typography variant="h6">{income}</Typography>
        </Paper>
        <Paper sx={{ p:2, width:200 }}>
          <Typography>Total Expense</Typography>
          <Typography variant="h6">{expense}</Typography>
        </Paper>
        <Paper sx={{ p:2, width:300 }}>
          <Typography>Remaining Budget</Typography>
          <Typography variant="h6">{remaining}</Typography>
        </Paper>
      </Box>

      <Box sx={{ mt:3 }}>
        <Typography variant="h6">Spending by Category</Typography>
        {byCategory.map((b:any)=> (
          <Box key={b._id} sx={{ mt:1 }}>
            <Typography>{b._id}: {b.total}</Typography>
            <LinearProgress variant="determinate" value={Math.min(100, (b.total / (b.total + 1) ) * 100)} />
          </Box>
        ))}
      </Box>
    </Container>
  );
}
