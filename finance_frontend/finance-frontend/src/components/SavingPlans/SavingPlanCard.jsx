import React from 'react';
import { Card, CardContent, Typography, LinearProgress, Box } from '@mui/material';

const SavingPlanCard = ({ plan }) => {
  const { title, description, progress } = plan;

  return (
    <Card sx={{ width: 300, m: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SavingPlanCard;
