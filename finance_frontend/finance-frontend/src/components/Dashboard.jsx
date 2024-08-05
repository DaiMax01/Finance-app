import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, TextField, Container, Button } from '@mui/material';
import SalesChart from './Dashboard/TransactionsLineChart';
import TransactionPieChart from './Dashboard/TransactionPieChart';
import TransactionLineByYearChart from './Dashboard/TransactionLineByYearChart';
import { useLoading } from './public/LoadingProvider';
import axiosInstance from '../axiosConfig';

const Dashboard = () => {
  const { showLoading, hideLoading } = useLoading();
  
  const [mainTransactionData, setMainTransactionData] = useState({ debits: [], credits: [] });
  const [mainStartDate, setMainStartDate] = useState('');
  const [mainEndDate, setMainEndDate] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [yearError, setYearError] = useState('');
  const [chart1Data, setChart1Data] = useState([]);
  const [chart2Data, setChart2Data] = useState([]);
  const [lastChartData, setLastChartData] = useState([]);

  const fetchData = async (setData, endpoint, params) => {
    showLoading();
    try {
      const response = await axiosInstance.get(endpoint, {
        params,
      });
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchData(setMainTransactionData, 'transaction-chart-data/', { start_date: mainStartDate, end_date: mainEndDate });
  }, [mainStartDate, mainEndDate]);

  useEffect(() => {
    fetchData(setChart1Data, 'transaction-by-type/', { start_date: mainStartDate, end_date: mainEndDate, transaction_type: 1 });
  }, [mainStartDate, mainEndDate]);

  useEffect(() => {
    fetchData(setChart2Data, 'transaction-by-type/', { start_date: mainStartDate, end_date: mainEndDate, transaction_type: 2 });
  }, [mainStartDate, mainEndDate]);

  const handleGenerateChart = () => {
    if (!yearFilter.match(/^\d{4}$/)) {
      setYearError('Please enter a valid year.');
      return;
    }

    setYearError('');
    fetchData(setLastChartData, 'transaction-chart-data/', { year: yearFilter });
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Container maxWidth="xxl" sx={{ width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Welcome to your Finance Managing App
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <TextField
                label="Start Date"
                type="date"
                value={mainStartDate}
                onChange={(e) => setMainStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
              <TextField
                label="End Date"
                type="date"
                value={mainEndDate}
                onChange={(e) => setMainEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                style={{ marginLeft: '10px' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" align="center" gutterBottom>
              Transactions Over Time
            </Typography>
            <SalesChart transactionData={mainTransactionData} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" align="center" gutterBottom>
              Total Income by Category
            </Typography>
            <TransactionPieChart chartData={chart1Data} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" align="center" gutterBottom>
              Total Expenses by Category
            </Typography>
            <TransactionPieChart chartData={chart2Data} />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <TextField
                label="Select year"
                type="text"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                error={!!yearError}
                helperText={yearError}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleGenerateChart} 
                style={{ marginLeft: '10px' }}
              >
                Generate Chart
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" align="center" gutterBottom>
              Transactions Over Time for Selected Year
            </Typography>
            <TransactionLineByYearChart transactionData={lastChartData} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
