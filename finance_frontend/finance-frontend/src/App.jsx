import * as React from 'react';
import Container from '@mui/material/Container';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Sidebar from './components/public/Sidebar';
import UserList from './components/UserList';
import TransactionList from './components/TransactionList';
import SavingplanList from './components/SavingplanList';
import BankaccountList from './components/BankaccountList'
import Dashboard from './components/Dashboard';
import SavingTypeList from './components/SavingTypeList';
import TransactionCategoryList from './components/TransactionCategoryList';


export default function App() {
  return (
    <div>
    <Router>
      <Sidebar>
          <Routes>
            <Route path="/users" Component={UserList}/>
            <Route path="/transactions" Component={TransactionList}/>
            <Route path="/saving-plans" Component={SavingplanList}/>
            <Route path="/bank-accounts" Component={BankaccountList}/>
            <Route path="/saving-types" Component={SavingTypeList}/>
            <Route path="/transaction-categories" Component={TransactionCategoryList}/>
            <Route path="" Component={Dashboard}/>
          </Routes> 
      </Sidebar>
      </Router>
    </div>
  );
}