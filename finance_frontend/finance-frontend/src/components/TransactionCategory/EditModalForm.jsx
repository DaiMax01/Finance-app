import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axiosInstance from '../../axiosConfig'; // Adjust the path as needed


const EditModalForm = ({ open, handleClose, selectedCategory, onReloadData,isEdit }) => {
  const [description, setDescription] = useState('');
  const [Code, setCode] = useState('');
  const [Type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && selectedCategory) {
      setDescription(selectedCategory.description || '');
      setCode(selectedCategory.code || '');
      setType(selectedCategory.type || '');
    }
    else{
      setDescription('');
      setCode('');
      setType('');
    }

  }, [selectedCategory]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
        if (isEdit) {
            await axiosInstance.put(`transaction-type/${selectedCategory.id}/`, {
              description,
              code: Code,
              type: Type,
            });
          } else {
            await axiosInstance.post(`transaction-type/`, {
              description,
              code: Code,
              type: Type,
            });
          }
        onReloadData();
        handleClose(); // Close modal on success
        setDescription('');
        setCode('');
        setType('');
    } catch (error) {
        setError(isEdit ? 'Failed to update Category.' : 'Failed to create Category.');
        console.error('Error saving Category', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Category Information</DialogTitle>
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
              label="Code"
              variant="outlined"
              fullWidth
              margin="normal"
              value={Code}
              onChange={(e) => setCode(e.target.value)}
              required
              inputProps={{ pattern: "\\d{1,4}" }}
              error={!/^\d{1,4}$/.test(Code)}
              helperText="Code must be a number with a maximum of 4 digits."
            />
            <FormControl fullWidth margin="normal" required>
                <InputLabel>Type of Transaction</InputLabel>
                <Select
                  value={Type}
                  onChange={(e) => setType(e.target.value)}
                  label="Type of Transaction"
                >
                  <MenuItem value={1}>Credit</MenuItem>
                  <MenuItem value={2}>Debit</MenuItem>
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
