import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, CircularProgress, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axiosInstance from '../../axiosConfig'; // Adjust the path as needed

const accountTypes = [
  { value: 3, label: "Business Account" },
  { value: 2, label: "Saving Account" },
  { value: 1, label: "Main Account" },
];

const EditModalForm = ({ open, handleClose, selectedSavingType, onReloadData,isEdit }) => {
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && selectedSavingType) {
      setDescription(selectedSavingType.description || '');
      setCode(selectedSavingType.code || '');
    }
    else{
      setDescription('');
      setCode('');
    }

  }, [selectedSavingType]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
        if (isEdit) {
            await axiosInstance.put(`saving-types/${selectedSavingType.id}/`, {
              description,
              code: code,
            });
          } else {
            await axiosInstance.post(`saving-types/`, {
              description,
              code: code,
            });
          }
        onReloadData();
        handleClose(); // Close modal on success
        setDescription('');
        setCode('');
    } catch (error) {
        setError(isEdit ? 'Failed to update Saving Type' : 'Failed to create Saving Type');
        console.error('Error saving Saving Type:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Saving Type Information</DialogTitle>
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
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              inputProps={{ pattern: "\\d{1,4}" }}
              error={!/^\d{1,4}$/.test(code)}
              helperText="Code must be a number with a maximum of 4 digits."
            />
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
