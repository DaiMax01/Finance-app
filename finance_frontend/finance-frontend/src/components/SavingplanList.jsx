import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, Container } from '@mui/material';
import SavingPlanCard from './SavingPlans/SavingPlanCard';
import axiosInstance from '../axiosConfig';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit'; // Import EditIcon
import SavingGoalModal from './SavingPlans/SavingPlanModal'; // Adjust the path as needed
import { ToastContainer, toast } from 'react-toastify';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default function SavingplanList() {
  const [savingGoals, setSavingGoals] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [reloadData, setReloadData]=useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSavingGoals([])
        const response = await axiosInstance.get('saving-goals/');
        console.log(response.data);
        setSavingGoals(response.data);
        toast.success('Saving Plans retrieved successfully!', {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        if (reloadData){
          setReloadData(!reloadData)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [reloadData]);

  const handleOpenModal = (goal = null) => {
    console.log("OPENING", goal)
    setSelectedGoal(goal);
    setIsEdit(!!goal); // Set to true if a goal is provided (edit mode)
    setOpenModal(true);
  };
  
  const handleDelete = (id) => {
    withReactContent(Swal).fire({
      title: 'Deleted entries can\'t be recovered, Proceed?',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      icon: 'warning',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try{
          const response = await axiosInstance.delete(`saving-goals/${id}`);
          console.log(response.data)
          Swal.fire('Deleted!', 'Entry has been deleted', 'success');
          setReloadData(true);
        }catch(error){
          Swal.fire('Error', 'Entry cannot be deleted', 'error');
        }
        
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Entry remains intact', 'error');
      }
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedGoal(null); // Clear selected goal when closing modal
  };

  const handleAddSavingGoal = (newGoal) => {
    setSavingGoals([...savingGoals, newGoal]);
  };

  const handleEditSavingGoal = (updatedGoal) => {
    setSavingGoals(savingGoals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal));
  };

  return (
    
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <ToastContainer/>
      <Container maxWidth="xl" sx={{ width: '100%' }}>
        <Typography variant='h3' align='center' gutterBottom >
          Saving Plans
        </Typography>
        <Grid container spacing={5} sx={{ mt: 2 }}>
          {savingGoals.map((plan, index) => (
            <Grid item key={index} xs={12} sm={6} md={6} lg={3}>
              <SavingPlanCard plan={plan} handleOpenModal={handleOpenModal} handleDelete={handleDelete}>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ marginTop: 1 }} // Pass the selected goal for editing
                >
                  <EditIcon />
                </Button>
              </SavingPlanCard>
            </Grid>
          ))}
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={6} 
            lg={3} 
            container 
            justifyContent="center" 
            alignItems="center"
          >
            <Button 
              variant="contained" 
              color="primary" 
              sx={{
                width: 70,
                height: 70,
                borderRadius: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onClick={() => handleOpenModal()} // Open modal in add mode
            >
              <AddIcon />
            </Button>
          </Grid>
        </Grid>
        <SavingGoalModal
          open={openModal}
          handleClose={handleCloseModal}
          addSavingGoal={handleAddSavingGoal}
          handleEdit={handleEditSavingGoal}
          isEdit={isEdit}
          savingGoalId={selectedGoal?.id} // Pass the ID of the selected goal for editing
          handleReload={setReloadData}
          
        />
      </Container>
    </Box>
  );
}
