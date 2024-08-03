import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, Button, FormControl, InputLabel, Box, CircularProgress } from '@mui/material';
import axiosInstance from '../../axiosConfig'; // Adjust the path as needed

const TransactionModal = ({ open, handleClose, addTransaction }) => {
  const [amount, setAmount] = useState('');
  const [typeOfTransaction, setTypeOfTransaction] = useState('');
  const [description, setDescription] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankAccounts, setBankAccounts] = useState([]);
  const [transactionCategories, setTransactionCategories] = useState([]);
  const [transactionCategory, setTransactionCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchBankAccounts = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get('bank-account/'); // Adjust endpoint as needed
          console.log(response.data);
          setBankAccounts(response.data);
        } catch (error) {
          console.error('Error fetching bank accounts:', error);
          setError('Failed to fetch bank accounts.');
        } finally {
          setLoading(false);
        }
      };

      fetchBankAccounts();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      const fetchTransactionCategories = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get('transaction-type/');
          setTransactionCategories(response.data);
        } catch (error) {
          console.error('Error fetching categories:', error);
          setError('Failed to fetch transaction categories');
        } finally {
          setLoading(false);
        }
      };
      fetchTransactionCategories();
    }
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post('transactions/', {
        amount,
        type_of_transaction: typeOfTransaction,
        description,
        bank_account: bankAccount,
        transaction_category: transactionCategory // Make sure this field is included
      });
      console.log('Transaction added:', response.data);

      // Call addTransaction from props to update the list
      addTransaction(response.data);

      handleClose(); // Close the modal on success
    } catch (error) {
      console.error('Error adding transaction:', error);
      setError('Failed to add transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Register Transaction</DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%', maxWidth: 600 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
              <CircularProgress />
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Amount"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Type of Transaction</InputLabel>
                <Select
                  value={typeOfTransaction}
                  onChange={(e) => setTypeOfTransaction(e.target.value)}
                  label="Type of Transaction"
                >
                  <MenuItem value={1}>Credit</MenuItem>
                  <MenuItem value={2}>Debit</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="transaction-category-label">Transaction category</InputLabel>
                <Select
                  labelId="transaction-category-label"
                  id="transaction_category"
                  value={transactionCategory}
                  onChange={(e) => setTransactionCategory(e.target.value)}
                  label="Transaction Category"
                >
                  {transactionCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="bank-account-label">Bank Account</InputLabel>
                <Select
                  labelId="bank-account-label"
                  id="bank_account"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  label="Bank Account"
                >
                  {bankAccounts.map((account) => (
                    <MenuItem key={account.id} value={account.id}>
                      {account.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <DialogActions>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add'}
                </Button>
                <Button onClick={handleClose} color="secondary" disabled={loading}>
                  Cancel
                </Button>
              </DialogActions>
            </form>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
