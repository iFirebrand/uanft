import React from 'react';
import { AppBar, Box, Container, Hidden, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import * as logo from '../img/logo.svg';

const Header = () => {
  return (
    <Box mb="80px">
      <AppBar position="fixed">
        <Toolbar>
          <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center">
                <Link to="/">
                  <Box display="flex" alignItems="center" mr={4}>
                    <img src="/logo.svg" alt="UA NFT" width={24} />
                    <Hidden smDown>
                      <Box ml={2} color="white" fontWeight="fontWeightMedium">
                        UA NFT
                      </Box>
                    </Hidden>
                  </Box>
                </Link>
              </Box>
              
            </Box>
          </Container>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
