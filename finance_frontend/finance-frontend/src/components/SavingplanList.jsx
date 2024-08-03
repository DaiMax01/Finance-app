import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import SavingPlanCard from './SavingPlans/SavingPlanCard';

const mockPlans = [
  { title: 'Plan A', description: 'Description for Plan A', progress: 50 },
  { title: 'Plan B', description: 'Description for Plan B', progress: 30 },
  { title: 'Plan C', description: 'Description for Plan C', progress: 70 },
  // Add more mock data as needed
];

export default function SavingplanList() {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant='h4' gutterBottom>Saving plans</Typography>
      <Grid container spacing={1}>
        {mockPlans.map((plan, index) => (
          <Grid item key={index}>
            <SavingPlanCard plan={plan} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
