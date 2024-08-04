import React from 'react';
import { Card, CardContent, Typography, LinearProgress, Box, Avatar,CardHeader } from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';

const SavingPlanCard = ({ plan }) => {
  const { description, amount, bank_account_balance } = plan;
  const progress = (bank_account_balance / amount) * 100;

  return (
 <Card sx={{ minWidth: 350, minHeight: 200, mb: 2, borderRadius: 2, boxShadow: 2 }}>
    <CardHeader
      title={description}
      titleTypographyProps={{ variant: 'h4', fontSize: 24 }}
      sx={{ backgroundColor: 'primary.main', color: 'white', py: 2,textAlign:'center' }}
    />
    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Avatar sx={{ mb: 2, backgroundColor: 'primary.main', width: 100, height: 100 }}>
        <SavingsIcon sx={{ fontSize: 70 }} />
      </Avatar>
      
      <Typography variant="h5" component="div" sx={{ fontSize: 20 }}>
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 18 }}>
        Goal Amount: $ {Number(amount).toFixed(2)}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 18 }}>
        Current Balance: $ {Number(bank_account_balance).toFixed(2)}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, width: '100%' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 16 }}>{`${Math.round(progress)}%`}</Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
  );
};

export default SavingPlanCard;