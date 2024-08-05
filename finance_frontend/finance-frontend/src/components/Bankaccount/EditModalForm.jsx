import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axiosInstance from '../../axiosConfig'; // Adjust the path as needed

const accountTypes = [
  { value: 3, label: "Business Account" },
  { value: 2, label: "Saving Account" },
  { value: 1, label: "Main Account" },
];

const EditModalForm = ({ open, handleClose, selectedBankAccount, onReloadData,isEdit }) => {
  const [description, setDescription] = useState('');
  const [accountCode, setAccountCode] = useState('');
  const [accountType, setAccountType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && selectedBankAccount) {
      setDescription(selectedBankAccount.description || '');
      setAccountCode(selectedBankAccount.account_code || '');
      setAccountType(selectedBankAccount.account_type || '');
    }
    else{
      setDescription('');
      setAccountCode('');
      setAccountType('');
    }

  }, [selectedBankAccount]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
        if (isEdit) {
            await axiosInstance.put(`bank-account/${selectedBankAccount.id}/`, {
              description,
              account_code: accountCode,
              account_type: accountType,
            });
          } else {
            await axiosInstance.post(`bank-account/`, {
              description,
              account_code: accountCode,
              account_type: accountType,
            });
          }
        onReloadData();
        handleClose(); // Close modal on success
        setDescription('');
        setAccountCode('');
        setAccountType('');
    } catch (error) {
        setError(isEdit ? 'Failed to update bank account.' : 'Failed to create bank account.');
        console.error('Error saving bank account:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Bank Account Information</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Description"
              fullWidth
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <TextField
              label="Account Code"
              fullWidth
              margin="normal"
              value={accountCode}
              onChange={(e) => setAccountCode(e.target.value)}
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="account-type-label">Account Type</InputLabel>
              <Select
                labelId="account-type-label"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                label="Account Type"
              >
                {accountTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <DialogActions>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
            </DialogActions>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditModalForm;
