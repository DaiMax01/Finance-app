import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

const getColor = (type_of_transaction) => {
  return type_of_transaction === 1 ? 'green' : 'red';
};

const ColorBar = styled('div')(({ color }) => ({
  width: '5px',
  height: '100%',
  backgroundColor: color,
  position: 'absolute',
  left: 0,
  top: 0,
}));

const TransactionCard = ({ transaction }) => {
  const { transaction_id, amount, type_of_transaction, transaction_date, description } = transaction;
  const roundedAmount = parseFloat(amount).toFixed(2);
  const color = getColor(type_of_transaction);

  return (
    <Card sx={{ marginBottom: 2, position: 'relative' }}>
      <ColorBar color={color} />
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">
            Transaction ID: {transaction_id}
          </Typography>
          <Typography variant="h6" color={color}>
            {type_of_transaction === 1 ? `+ $ ${roundedAmount}` : `- $ ${roundedAmount}`}
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary">
          Date: {transaction_date}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Type of transaction: {type_of_transaction === 1 ? `Deposit` : `Withdrawal`}
        </Typography>
        <Typography variant="body2">
          Description: {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
