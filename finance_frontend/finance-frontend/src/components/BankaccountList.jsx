import React, { useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import DataTable from './public/DataTable';
import EditModalForm from './Bankaccount/EditModalForm'; // Adjust the import path
import axiosInstance from '../axiosConfig';

const columns = [
  { field: 'id', headerName: 'ID', width: 10, headerClassName: 'table-header', headerAlign: 'center', align: 'center' },
  { field: 'description', headerName: 'Description', width: 400, headerClassName: 'table-header', flex: 1, headerAlign: 'center', align: 'center' },
  { field: 'account_code', headerName: 'Code', width: 300, headerClassName: 'table-header', flex: 1, headerAlign: 'center', align: 'center' },
  { field: 'account_type_display', headerName: 'Account Type', width: 150, headerClassName: 'table-header', flex: 1, headerAlign: 'center', align: 'center' },
  { field: 'current_balance', headerName: 'Balance', width: 150, headerClassName: 'table-header', flex: 1, headerAlign: 'center', align: 'center' }
];

const BankaccountList = () => {
  const [selectedBankAccount, setSelectedBankAccount] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false); // New state to handle add/edit mode
  const [reloadData, setReloadData] = useState(false);

  const handleEdit = async (id) => {
    try {
      const response = await axiosInstance.get(`bank-account/${id}/`);
      setSelectedBankAccount(response.data);
      setIsEdit(true);
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching bank account:', error);
    }
  };

  const handleAdd = () => {
    setSelectedBankAccount(null);
    setIsEdit(false);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedBankAccount(null);
  };

  const handleReloadData = () => {
    setReloadData(!reloadData);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Container maxWidth="xl" sx={{ width: '100%', textAlign: 'center' }}>
        <Typography variant='h3'>List of Bank Accounts</Typography>

        <Box  sx={{ mt: 5 }}>
            <Box sx={{display:'flex',p: 2,justifyContent:'end'}}><Button variant="contained" color="primary" onClick={handleAdd}>
              Add New Bank Account
            </Button></Box>

          <DataTable endpoint="bank-account/" columns={columns} onEdit={handleEdit} reloadData={reloadData} onReloadData={handleReloadData} isEdit={isEdit}/>
        </Box>
      </Container>
      <EditModalForm
        open={modalOpen}
        handleClose={handleClose}
        selectedBankAccount={selectedBankAccount}
        onReloadData={handleReloadData}
        isEdit={isEdit} // Pass isEdit prop
      />
    </Box>
  );
};

export default BankaccountList;
