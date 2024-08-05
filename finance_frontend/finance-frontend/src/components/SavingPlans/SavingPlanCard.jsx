import React from 'react';
import { Card, CardContent, Typography, LinearProgress, Box, Avatar, CardHeader, IconButton } from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const SavingPlanCard = ({ plan,handleOpenModal,handleDelete }) => {
  const {id, description, amount, bank_account_balance, saving_type_display } = plan;
  const progress = (bank_account_balance / amount) * 100;

  return (
    <Card sx={{ minWidth: 250, minHeight: 500, mb: 2, borderRadius: 2, boxShadow: 2, display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={description}
        titleTypographyProps={{ variant: 'h6' }}
        sx={{ backgroundColor: 'primary.main', color: 'white', py: 2, textAlign: 'center' }}
        action={
          <Box>
            <IconButton aria-label="edit" onClick={() => handleOpenModal(plan)}>
              <EditIcon sx={{ color: 'white' }} />
            </IconButton>
            <IconButton aria-label="info" onClick={()=>handleDelete(id)}>
              <DeleteIcon sx={{ color: 'white' }}/>
            </IconButton>
          </Box>
        }
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, justifyContent: 'space-between' }}>
        <Avatar sx={{ mb: 2, backgroundColor: 'secondary.main', width: 120, height: 120 }}>
          <SavingsIcon sx={{ fontSize: 80 }} />
        </Avatar>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: 18 }}>
            Goal Amount: $ {Number(amount).toFixed(2)}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: 18 }}>
            Current Balance: $ {Number(bank_account_balance).toFixed(2)}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: 18 }}>
            Saving Type: {saving_type_display}
          </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, width: '100%' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <Typography>Goal Progress</Typography>
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
