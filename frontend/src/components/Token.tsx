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

    function mint(amount: number) {
        if (!provider) {
            throw new Error('No provider');
        }
        
        const signer = provider.getSigner(account);
        const contract = new Contract( address[networkId] , abi, signer );
        
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
                <ReactPlayer url='https://ipfs.infura.io/ipfs/QmTzknUDPqQD328SWoJYjoCuKWLnECN6Pnw9NPeCXrXPre' controls={true} />
            </Grid>

            <Grid item xs={12} sm={12}>
                <h2>Snake Island</h2>

                <p>
                The phrase: “<strong>Russian warship: fuck off!</strong>” became a
                uniting call for Ukrainians in their defense against the Russian war.
                On February 24th 2022 two Russian warships (Moscow & Vasilij Bikov)
                approached the Ukrainian Zmijinij ostriv (
                <a
                    href="https://uk.wikipedia.org/wiki/%D0%97%D0%BC%D1%96%D1%97%D0%BD%D0%B8%D0%B9_(%D0%BE%D1%81%D1%82%D1%80%D1%96%D0%B2)"
                    target="_blank"
                >
                    Snake Island
                </a>
                ) on the Black Sea. One of the warships made an ultimatum for the
                Ukrainian border guards to lay down the arms and surrender. The
                servicemen and women, understanding their fate, refused to do so and
                told Russians to fuck off. The{" "}
                <a href="https://www.navytimes.com/news/your-navy/2022/02/25/ukrainians-trapped-on-snake-island-to-the-russians-demanding-their-surrender-go-fck-yourself/">
                    media
                </a>{" "}
                reports that the Russian vessels fired rockets and bombed with a SU-24
                combat aircraft. The contact with the island was lost and everyone was
                presumed dead as <a>declared</a> by President Zelensky. As for
                February 26th, 2022, there are unconfirmed reports that some of the
                servicemen have been captured and held in Ukrainian Crimea temporarily
                occupied by the Russian forces. The Navy Times has{" "}
                <a
                    href="https://www.navytimes.com/news/your-navy/2022/02/25/ukrainians-trapped-on-snake-island-to-the-russians-demanding-their-surrender-go-fck-yourself/"
                    target="_blank"
                >
                    coverage
                </a>
                of the incident.
                </p>

                <p>
                This NFT is an ERC-1155 on the Ethereum mainnet priced at 0.01 ETH
                with all proceeds benefiting{" "}
                <a href="https://savelife.in.ua/donate/" target="_blank">
                    Save A Life
                </a>{" "}
                organization. Your donation will drop into their Ethereum{" "}
                <a
                    href="https://etherscan.io/address/0xa1b1bbB8070Df2450810b8eB2425D543cfCeF79b"
                    target="_blank"
                >
                    wallet
                </a>{" "}
                as listed on the organization’s FB{" "}
                <a
                    href="https://www.facebook.com/backandalive/posts/2234632643360827"
                    target="_blank"
                >
                    page
                </a>
                . A dashboard for the project will be created later.
                </p>

                <p>
                Your NFT purchase will help soldiers fight for Ukraine's freedom and
                independence.
                </p>

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
                <Box display="flex" justifyContent="center" mt={2}>

                    <Box display="flex">
                        <Typography fontSize="small">
                            <a href={`http://opensea.io/assets/${address[networkId]}/1`} target="_blank">OpenSea</a>
                        </Typography>
                        <Box mx={1}>|</Box>
                        <Typography fontSize="small">
                            <a href={`http://etherscan.io/address/${address[networkId]}`} target="_blank">Contract</a>
                        </Typography>

                    </Box>
                    
                </Box>
            </Grid>
            
        </Grid>
    )

}

export default Token;
