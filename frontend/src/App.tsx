import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import AppProviders from './AppProviders';
import HomePage from './components/HomePage';


function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

export default function App() {
  return (
    <Container maxWidth="sm">
        <AppProviders>
          <Router>
            <Routes>
              {/* <Route key="itemPage" path={`/token/:tokenId`} component={ItemPage} /> */}
              <Route key="home" path="/" element={<HomePage />} />
            </Routes>
          </Router>
      </AppProviders>
      
    </Container>
  );
}
