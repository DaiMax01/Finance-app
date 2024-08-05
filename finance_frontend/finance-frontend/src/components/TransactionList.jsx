import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { Box, Container, Typography, Button, CircularProgress, Fade, Paper, Grid, TextField } from '@mui/material';
import TransactionCard from './Transactions/TransactionCard'; // Adjust the path as needed
import TransactionModal from './Transactions/TransactionModal'; // Adjust the path as needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLoading } from './public/LoadingProvider'; // Adjust the path as needed

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [nextUrl, setNextUrl] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalDebits, setTotalDebits] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const { loading, showLoading, hideLoading } = useLoading();
  const [loadAll, setLoadAll] = useState(false);

  const fetchData = async () => {
    showLoading();
    try {
      const response = await axiosInstance.get('transactions/', {
        params: {
          start_date: startDate,
          end_date: endDate,
          get_all: loadAll ? 'true' : 'false',
        },
      });
      setTransactions(response.data.results);
      setNextUrl(response.data.next);
      hideLoading();
      toast.success('Transactions retrieved successfully!', {
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
      hideLoading();
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate,loadAll]);

  useEffect(() => {
    const calculateTotals = () => {
      const debits = transactions.reduce((total, transaction) => {
        return transaction.type_of_transaction === 2 ? total + Number(transaction.amount) : total;
      }, 0);
      const credits = transactions.reduce((total, transaction) => {
        return transaction.type_of_transaction === 1 ? total + Number(transaction.amount) : total;
      }, 0);
      setTotalDebits(debits);
      setTotalCredits(credits);
    };
    calculateTotals();
  }, [transactions]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const addTransaction = (newTransaction) => {
    setTransactions((prevTransactions) => [newTransaction, ...prevTransactions]);
    toast.success('New Transaction Registered Successfully!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const loadMoreTransactions = async () => {
    if (nextUrl) {
      setLoadingMore(true);
      showLoading();
      try {
        const response = await axiosInstance.get(nextUrl);
        setTransactions((prevTransactions) => [...prevTransactions, ...response.data.results]);
        setNextUrl(response.data.next);
        setLoadingMore(false);
        hideLoading();
      } catch (error) {
        console.error('Error fetching more transactions:', error);
        setLoadingMore(false);
        hideLoading();
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <ToastContainer />
      <Container maxWidth="xl" sx={{ width: '100%' }}>
        <Typography variant="h3" align='center' gutterBottom>
          Transaction History
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2, mt: 5 }}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid
            item xs={12} sm={6} md={4}
            container
            display="flex"
            justifyContent="flex-end"
            alignItems="stretch"
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenModal}
              sx={{
                mb: 2,
                width: '100%',
                height: '100%',
                py: 0 // or paddingY: 0
              }}
            >
              Register Transaction
            </Button>
          </Grid>
        </Grid>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Current Summary
          </Typography>
          <Typography variant="h6" color='red'>
            Total Debits: $ {totalDebits.toFixed(2)}
          </Typography>
          <Typography variant="h6" color='green'>
            Total Credits: $ {totalCredits.toFixed(2)}
          </Typography>
          <Typography variant="h6">
            Net Amount: $ {(totalCredits - totalDebits).toFixed(2)}
          </Typography>
        </Box>
        <Paper sx={{ maxHeight: 500, overflow: 'auto', padding: 3 }}>
          {transactions.map((transaction) => (
            <Fade in={true} timeout={1000} key={transaction.id}>
              <div>
                <TransactionCard transaction={transaction} />
              </div>
            </Fade>
          ))}
        </Paper>
        {nextUrl && (
          <Button
            variant="outlined"
            onClick={loadMoreTransactions}
            disabled={loadingMore}
            sx={{ mt: 2 }}
          >
            {loadingMore ? <CircularProgress size={24} /> : 'Load More'}
          </Button>
        )}
        <Button
        variant="contained"
        color="secondary"
        onClick={() => setLoadAll(true)}
        sx={{ mt: 2 }}
      >
        LOAD ALL
      </Button>
      </Container>
      <TransactionModal
        open={modalOpen}
        handleClose={handleCloseModal}
        addTransaction={addTransaction}
      />
    </Box>
  );
};

export default TransactionList;
