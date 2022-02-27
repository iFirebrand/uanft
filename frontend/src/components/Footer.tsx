import React from 'react';

import { Box, Typography } from '@mui/material';


interface FooterProps {
    contractAddress: string;
}

const Footer = ({contractAddress} : FooterProps) => {
    return (
        <Box display="flex" justifyContent="center" mt={2}>

            <Box display="flex">
                <Typography fontSize="small">
                    <a href={`http://opensea.io/assets/${contractAddress}/1`} target="_blank">OpenSea</a>
                </Typography>
                <Box mx={1}>|</Box>
                <Typography fontSize="small">
                    <a href={`http://etherscan.io/address/${contractAddress}`} target="_blank">Contract</a>
                </Typography>
            </Box>
            
        </Box>

    );
}

export default Footer;