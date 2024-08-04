import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, Button, FormControl, InputLabel, Box, CircularProgress } from '@mui/material';
import axiosInstance from '../../axiosConfig'; // Adjust the path as needed

const SavingGoalModal = ({ open, handleClose, addSavingGoal }) => {
  const [code, setCode] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [savingType, setSavingType] = useState('');
  const [bankAccounts, setBankAccounts] = useState([]);
  const [savingTypes, setSavingTypes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchBankAccounts = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get('bank-account/'); // Adjust endpoint as needed
          setBankAccounts(response.data);
        } catch (error) {
          console.error('Error fetching bank accounts:', error);
          setError('Failed to fetch bank accounts.');
        } finally {
          setLoading(false);
        }
      };

      const fetchSavingTypes = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get('saving-types/'); // Adjust endpoint as needed
          setSavingTypes(response.data);
        } catch (error) {
          console.error('Error fetching saving types:', error);
          setError('Failed to fetch saving types.');
        } finally {
          setLoading(false);
        }
      };

      fetchBankAccounts();
      fetchSavingTypes();
    }
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post('saving-goals/', {
        code,
        amount,
        description,
        bank_account: bankAccount,
        saving_type: savingType,
      });
      console.log('Saving goal added:', response.data);

      // Call addSavingGoal from props to update the list
      addSavingGoal(response.data);

      handleClose(); // Close the modal on success
    } catch (error) {
      console.error('Error adding saving goal:', error);
      setError('Failed to add saving goal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Register Saving Goal</DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%', maxWidth: 600 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
              <CircularProgress />
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Code"
                variant="outlined"
                fullWidth
                margin="normal"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
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
                <InputLabel>Bank Account</InputLabel>
                <Select
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
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Saving Type</InputLabel>
                <Select
                  value={savingType}
                  onChange={(e) => setSavingType(e.target.value)}
                  label="Saving Type"
                >
                  {savingTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.description}
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

export default SavingGoalModal;
