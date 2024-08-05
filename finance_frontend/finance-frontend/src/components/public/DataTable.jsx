import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from '../../axiosConfig'; // Asegúrate de que la ruta sea correcta
import { IconButton, Box, Typography, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
// Componente para los botones de acción
const ActionButtons = ({ id, onEdit, onDelete }) => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <IconButton onClick={() => onEdit(id)} color="primary">
      <EditIcon />
    </IconButton>
    <IconButton onClick={() => onDelete(id)} color="secondary">
      <DeleteIcon />
    </IconButton>
  </div>
);

const DataTable = ({ endpoint, columns, title, onEdit, reloadData, onReloadData,handleDelete }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(endpoint);
      console.log('API Response:', response.data);
      setRows(response.data);
      toast.success('Data retrieved successfully!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("fetching data")
    fetchData();
    if(reloadData){
      onReloadData()
    }
  }, [endpoint,reloadData]);
  onEdit
  // Agrega la columna de acciones a las columnas
  const actionColumn = {
    field: 'actions',
    headerName: 'Actions',
    headerClassName: 'table-header',
    width: 150,
    renderCell: (params) => (
      <ActionButtons
        id={params.row.id}
        onEdit={onEdit}
        onDelete={handleDelete}
      />
    ),
  };

  return (
    <Box sx={{ width: '100%', p: 2, '& .table-header': { backgroundColor: theme.palette.primary.main, color: 'white' } }}>
      {/* Encabezado */}
      <ToastContainer/>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
      </Box>

      {/* DataGrid */}
      <Box>
        <DataGrid
          sx={{ width: '100%',height:600 ,textAlign:'center'}}
          rows={rows}
          columns={[...columns, actionColumn]} // Añade la columna de acciones
          loading={loading}
          pagination
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          getRowId={(row) => row.id} // Asegúrate de que el campo 'id' se utiliza correctamente
        />
      </Box>
    </Box>
  );
};

export default DataTable;
