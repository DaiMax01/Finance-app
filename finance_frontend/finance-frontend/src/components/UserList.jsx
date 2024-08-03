import React from 'react';
import DataTable from './public/DataTable';
import { Box, Container } from '@mui/material';
const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'username', headerName: 'Username', width: 150 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'first_name', headerName: 'First Name', width: 150 }, // Ajusta según tus necesidades
  { field: 'last_name', headerName: 'Last Name', width: 150 }  // Ajusta según tus necesidades
];

const UserList = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Container maxWidth="xl" sx={{ width: '100%' }}>
        <h1>User List</h1>
        <DataTable endpoint="users/" columns={columns} />
      </Container>
    </Box>
  );
};

export default UserList;