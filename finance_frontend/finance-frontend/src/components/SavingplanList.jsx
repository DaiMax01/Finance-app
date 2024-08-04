import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, Container } from '@mui/material';
import SavingPlanCard from './SavingPlans/SavingPlanCard';
import axiosInstance from '../axiosConfig';
import AddIcon from '@mui/icons-material/Add';
import SavingGoalModal from './SavingPlans/SavingPlanModal'; // Adjust the path as needed

export default function SavingplanList() {
  const [savingGoals, setSavingGoals] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('saving-goals/');
        console.log(response.data);
        setSavingGoals(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAddSavingGoal = (newGoal) => {
    setSavingGoals([...savingGoals, newGoal]);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Container maxWidth="xl" sx={{ width: '100%' }}>
        <Typography variant='h3' align='center' gutterBottom sx={{ mb: 2 }}>
          Saving Plans
        </Typography>
        <Grid container spacing={5} sx={{mt:5}}>
          {savingGoals.map((plan, index) => (
            <Grid item key={index} sm={10} md={3}>
              <SavingPlanCard plan={plan} />
            </Grid>
          ))}
          <Grid 
            item 
            xs={12} 
            sm={10} 
            md={3} 
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
              onClick={handleOpenModal}
            >
              <AddIcon />
            </Button>
          </Grid>
        </Grid>
        <SavingGoalModal
          open={openModal}
          handleClose={handleCloseModal}
          addSavingGoal={handleAddSavingGoal}
        />
      </Container>
    </Box>
  );
}
