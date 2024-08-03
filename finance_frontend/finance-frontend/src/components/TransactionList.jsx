import React, { Component } from 'react';
import axiosInstance from '../axiosConfig';
import { Box, Container, Typography, Button, CircularProgress, Fade } from '@mui/material';
import TransactionCard from './Transactions/TransactionCard'; // Adjust the path as needed
import TransactionModal from './Transactions/TransactionModal'; // Adjust the path as needed

class TransactionList extends Component {
  state = {
    transactions: [],
    loading: true,
    modalOpen: false,  // Manage modal open state
    nextUrl: null,     // URL for fetching next page
    loadingMore: false, // Manage loading state for "Load More"
  };

  async componentDidMount() {
    try {
      const response = await axiosInstance.get('transactions/');
      console.log(response.data);
      this.setState({
        transactions: response.data.results,
        nextUrl: response.data.next, // Set the URL for the next page
        loading: false
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      this.setState({ loading: false });
    }
  }

  handleOpenModal = () => {
    this.setState({ modalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ modalOpen: false });
  };

  addTransaction = (newTransaction) => {
    this.setState((prevState) => ({
      transactions: [newTransaction, ...prevState.transactions] // Add new transaction to the top of the list
    }));
  };

  loadMoreTransactions = async () => {
    const { nextUrl } = this.state;

    if (nextUrl) {
      this.setState({ loadingMore: true });

      try {
        const response = await axiosInstance.get(nextUrl);
        this.setState((prevState) => ({
          transactions: [...prevState.transactions, ...response.data.results],
          nextUrl: response.data.next, // Update the next URL
          loadingMore: false
        }));
      } catch (error) {
        console.error('Error fetching more transactions:', error);
        this.setState({ loadingMore: false });
      }
    }
  };

  render() {
    const { transactions, loading, modalOpen, loadingMore } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="xl" sx={{ width: '100%' }}>
          <Typography variant="h4" align='center' gutterBottom>
            Transaction History
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleOpenModal}
            sx={{ mb: 2 }}
          >
            Register Transaction
          </Button>
          {transactions.map((transaction, index) => (
            <Fade in={true} timeout={1000} key={transaction.id}>
              <div>
                <TransactionCard transaction={transaction} />
              </div>
            </Fade>
          ))}
          {this.state.nextUrl && (
            <Button
              variant="outlined"
              onClick={this.loadMoreTransactions}
              disabled={loadingMore}
              sx={{ mt: 2 }}
            >
              {loadingMore ? <CircularProgress size={24} /> : 'Load More'}
            </Button>
          )}
        </Container>
        <TransactionModal
          open={modalOpen}
          handleClose={this.handleCloseModal}
          addTransaction={this.addTransaction} // Pass addTransaction as a prop
        />
      </Box>
    );
  }
}

export default TransactionList;
