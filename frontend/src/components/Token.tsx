import React, { useState } from 'react';
import { Box } from '@mui/system';
import ReactPlayer from 'react-player'
import { Alert, Button, Grid, TextField, Typography } from '@mui/material';
import { useWallet } from '../hooks/useWallet';
import { networkId, networkName } from '../config';
import { useMutation } from 'react-query';
import { abi, address } from '../contract/uanft';
import { Contract } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { notifyTx } from '../utils/notification';
import Content from './Content';
import Footer from './Footer';
import ResponsivePlayer from './ResponsivePlayer';

const MIN_COST = parseEther('0.01');

const Token = () => {

    const { connect,
        provider,
        account,
        network,
        disconnect,
        web3Modal, 
    } = useWallet();

    const [mintAmount, setMintAmount] = useState(1);
    const [mintPrice, setMintPrice] = useState(MIN_COST);
    const [txPending, setTxPending] = useState(false);
    const [txSuccess, setTxSuccess] = useState(false);

    const connected = account && network && network.chainId === networkId;

    async function mint(amount: number) {
        if (!provider) {
            throw new Error('No provider');
        }
        const contractAddress = address[networkId];

        const bytecode = await provider.getCode(contractAddress);
        if (bytecode === '0x') {
            throw new Error(`Contract ${contractAddress} does not exist`);
        }
        console.log(`Attempting mint transaction on contract ${contractAddress}`);
        
        const signer = provider.getSigner(account);
        const contract = new Contract( contractAddress , abi, signer );
        
        return notifyTx({
            method: () => contract.publicMint(1, mintAmount, {value: mintPrice}),
            chainId: networkId,
            success: 'Successfully minted NFT',
            onSubmitted: () => setTxPending(true),
            onSuccess: () => setTxSuccess(true),
          });

    }

    const mutation = useMutation(mint, {});

    function handleMintAmountChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        const amount = parseInt(e.target.value);
        if (amount > 0 && amount <= 1000) {
            setMintAmount(amount)
            const price = (0.01 * amount).toString();
            setMintPrice(parseEther(price));
        }
    }

    return (
        <Grid container spacing={2}>

            <Grid item xs={12} sm={12}>
                <ResponsivePlayer />
            </Grid>

            <Grid item xs={12} sm={12}>
                <Content />
            </Grid>

            <Grid item xs={12} sm={12}>
            <Box display="flex" justifyContent="center">
                    
                { connected ? (
                    <>
                        <Box display="flex" width={"150px"}>
                            <TextField
                            id="outlined-number"
                            label="Amount"
                            type="number"
                            value={mintAmount}
                            onChange={handleMintAmountChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{
                                mr: 2,
                            }}
                            />
                        </Box>

                        <Button color="secondary" variant="contained" onClick={() => mutation.mutate(mintAmount)}>Mint {formatEther(mintPrice)} Ξ</Button>
                    </>
                ) : network && network.chainId !== networkId ? (
                    <Alert severity='info'>Please connect to the {networkName} network to mint.</Alert>
                ) : (
                    <Button color="secondary" variant="contained" onClick={() => connect()}>Connect Wallet</Button>
                )
                }
            </Box>
            </Grid>

            <Grid item xs={12} sm={12}>
                <Footer contractAddress={address[networkId]} />
            </Grid>
            
        </Grid>
    )

}

export default Token;
