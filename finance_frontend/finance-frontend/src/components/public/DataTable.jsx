import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from '../../axiosConfig'; // Asegúrate de que la ruta sea correcta
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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

const DataTable = ({ endpoint, columns }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(endpoint);
        console.log('API Response:', response.data); // Verifica la estructura aquí
        setRows(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  // Funciones para manejar las acciones
  const handleEdit = (id) => {
    console.log('Edit', id);
    // Implementa la lógica de edición aquí
  };

  const handleDelete = (id) => {
    console.log('Delete', id);
    // Implementa la lógica de eliminación aquí
  };

  // Agrega la columna de acciones a las columnas
  const actionColumn = {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: (params) => (
      <ActionButtons
        id={params.row.id}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    ),
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={[...columns, actionColumn]} // Añade la columna de acciones
        loading={loading}
        pagination
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        // No incluye checkboxSelection para quitar la columna de selección
        getRowId={(row) => row.id} // Asegúrate de que el campo 'id' se utiliza correctamente
      />
    </div>
  );
};

export default DataTable;
