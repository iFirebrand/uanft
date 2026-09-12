import { useEffect, useRef, useState } from 'react';
import { Contract, BrowserProvider, JsonRpcProvider } from 'ethers';
import * as utils from 'ethers';
import { abi, address } from './contract/uanft';
const CONTRACT = address[1];
const BENEFICIARY = '0xa1b1bbB8070Df2450810b8eB2425D543cfCeF79b';
const OPENSEA = `https://opensea.io/item/ethereum/${CONTRACT}/1`;
type Stats = { minted: string; raised: string; transactions: number; asOf: string; recent: {hash: string; amount: string; eth: string; date: string}[] };
const rpc = () => new JsonRpcProvider(import.meta.env.VITE_ETHEREUM_RPC_URL || 'https://ethereum.publicnode.com', 1);
const errorMessage = (e: any) => e?.code === 4001 || e?.code === 'ACTION_REJECTED' ? 'Request cancelled. You have not been charged.' : e?.reason || e?.message || 'Something went wrong. Please try again.';
const External = ({href, children}: {href: string; children: React.ReactNode}) => <a href={href} target="_blank" rel="noopener noreferrer">{children} ↗</a>;
export default function App() {
 const [stats, setStats] = useState<Stats>(); const [statsError, setStatsError] = useState(false);
 const [account, setAccount] = useState(''); const [chain, setChain] = useState(0); const [quantity, setQuantity] = useState('1');
 const [price, setPrice] = useState(''); const [eligible, setEligible] = useState(false); const [recipient, setRecipient] = useState('');
 const [busy, setBusy] = useState(false); const [message, setMessage] = useState(''); const [hash, setHash] = useState(''); const [confirmed, setConfirmed] = useState(false);
 const wallet = useRef<any>(undefined); const cleanup = useRef<() => void>(() => {});
 const amount = Number(quantity); const valid = Number.isInteger(amount) && amount >= 1 && amount <= 1000;
 const total = price && valid ? utils.formatEther(utils.parseEther(price) * BigInt(amount)) : '—';
 async function loadStats() { try { const response = await fetch('/api/stats'); if (!response.ok) throw Error(); setStats(await response.json()); setStatsError(false); } catch { setStatsError(true); } }
 async function checkContract(provider: JsonRpcProvider | BrowserProvider = rpc()) {
  setEligible(false);
  try { const contract = new Contract(CONTRACT, abi, provider); const [data, payee] = await Promise.all([contract.tokenData(1), contract.recipient()]); setPrice(utils.formatEther(data.mintPrice)); setRecipient(payee); setEligible(data.created && data.enabled && payee.toLowerCase() === BENEFICIARY.toLowerCase()); }
  catch { setMessage('We could not verify mint availability. Please retry before minting.'); }
 }
 useEffect(() => { void loadStats(); void checkContract(); const timer = setInterval(loadStats, 60000); return () => { clearInterval(timer); cleanup.current(); }; }, []);
 async function connect(mobile = false) {
  setBusy(true); setMessage('');
  try {
   let injected = (window as any).ethereum;
   if (mobile || !injected) {
    const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
    if (!projectId) throw Error('Open this page in your mobile wallet’s browser to connect. WalletConnect will be available once configured.');
    const { default: EthereumProvider } = await import('@walletconnect/ethereum-provider');
    injected = await EthereumProvider.init({projectId, chains: [1], showQrModal: true, rpcMap: {1: import.meta.env.VITE_ETHEREUM_RPC_URL || 'https://ethereum.publicnode.com'}, metadata: {name: 'Snake Island NFT', description: 'Mint for Ukraine', url: window.location.origin, icons: [window.location.origin + '/android-chrome-192x192.png']}});
   }
   const accounts = await injected.request({method: 'eth_requestAccounts'}); const chainId = await injected.request({method: 'eth_chainId'});
   cleanup.current(); wallet.current = injected; setAccount(accounts[0] || ''); setChain(Number(chainId));
   const onAccounts = (accounts: string[]) => { setAccount(accounts[0] || ''); setMessage(''); setHash(''); };
   const onChain = (id: string) => {setChain(Number(id)); setMessage('');};
   const onDisconnect = () => {setAccount(''); setChain(0);};
   injected.on?.('accountsChanged', onAccounts); injected.on?.('chainChanged', onChain); injected.on?.('disconnect', onDisconnect);
   cleanup.current = () => {injected.removeListener?.('accountsChanged', onAccounts); injected.removeListener?.('chainChanged', onChain); injected.removeListener?.('disconnect', onDisconnect);};
   if (Number(chainId) === 1) await checkContract(new BrowserProvider(injected, 'any'));
  } catch (e) {setMessage(errorMessage(e));} finally {setBusy(false);}
 }
 async function switchNetwork() {setBusy(true); try {await wallet.current.request({method:'wallet_switchEthereumChain',params:[{chainId:'0x1'}]}); setChain(1); await checkContract(new BrowserProvider(wallet.current, 'any'));} catch(e) {setMessage(errorMessage(e));} finally {setBusy(false);}}
 async function mint() {
  if (!valid || !eligible || !wallet.current) return;
  setBusy(true); setHash(''); setConfirmed(false); setMessage('Check the details and confirm in your wallet.');
  try {
   const provider = new BrowserProvider(wallet.current, 'any'); if ((await provider.getNetwork()).chainId !== 1n) throw Error('Switch to Ethereum Mainnet before minting.');
   const signer = await provider.getSigner(); const contract = new Contract(CONTRACT, abi, signer);
   const [data, payee] = await Promise.all([contract.tokenData(1), contract.recipient()]);
   if (!data.created || !data.enabled || payee.toLowerCase() !== BENEFICIARY.toLowerCase()) throw Error('Minting is unavailable or the beneficiary has changed. Please contact the project.');
   if (utils.formatEther(data.mintPrice) !== price) {await checkContract(provider); throw Error('The price changed. Review the updated total and try again.');}
   const tx = await contract.publicMint(1, amount, {value: data.mintPrice * BigInt(amount)}); setHash(tx.hash); setMessage('Transaction submitted. Waiting for Ethereum confirmation…');
   try { await tx.wait(); } catch (e: any) { if (e.code !== 'TRANSACTION_REPLACED' || e.cancelled || e.receipt?.status !== 1) throw e; setHash(e.replacement.hash); }
   setConfirmed(true); setMessage('Mint confirmed. Thank you for standing with Ukraine.'); void loadStats();
  } catch(e) {setMessage(errorMessage(e));} finally {setBusy(false);}
 }
 return <>
 <a className="skip" href="#main">Skip to content</a>
 <header><a className="brand" href="#"><span className="flag"/> UA NFT <span className="brand-detail">/ SNAKE ISLAND</span></a><nav aria-label="Main navigation"><a href="#story">The story</a><a href="#impact">The impact</a><a className="nav-mint" href="#mint">Mint for Ukraine ↗</a></nav></header>
 <main id="main">
 <section className="hero"><div className="hero-copy"><p className="eyebrow"><span className="dot"/> CREATED IN 2022. STILL STANDING.</p><h1>A small island.<br/>An <em>unbreakable</em><br/>spirit.</h1><p className="intro">A moment of defiance. A piece of history.<br/>The original Snake Island NFT, created to turn the shock of invasion into support for Ukraine.</p><div className="hero-actions"><a className="button" href="#mint">Mint for Ukraine <span>↗</span></a><a className="text-link" href="#story">Discover the story ↓</a></div><p className="fine">Ethereum · Original 2022 contract · Supporting Come Back Alive</p></div>
 <div className="artwork"><div className="art-top"><span>THE SNAKE ISLAND EDITION</span><span>№ 001</span></div><video controls playsInline preload="metadata" aria-label="Original animated Snake Island NFT artwork" poster="/artwork.jpg" src="/preview.mp4"/><div className="art-bottom"><div><strong>Russian warship, go fuck yourself.</strong><span>Snake Island, Ukraine · February 24, 2022</span></div><a href={OPENSEA} target="_blank" rel="noopener noreferrer" aria-label="View the Snake Island NFT on OpenSea">↗</a></div></div></section>
 <div className="manifesto"><span>REMEMBER THE DEFIANCE.</span><span>STAND WITH UKRAINE.</span><span>MAKE YOUR SUPPORT COUNT. ↗</span></div>
 <section className="mint-section" id="mint"><div><p className="eyebrow">01 / COLLECT WITH PURPOSE</p><h2>Own the moment.<br/><em>Support the fight.</em></h2><p>This is more than a collectible. It is a way to remember the defenders of Snake Island and help Ukraine defend its freedom.</p><p>The original artwork. The original Ethereum contract. A renewed call to show up.</p><External href={OPENSEA}>Explore the NFT on OpenSea</External></div>
 <div className="mint-card"><div className="card-heading"><h3>Mint the Snake Island NFT</h3><span>ERC-1155</span></div><p>Your mint payment is forwarded by the contract to its configured beneficiary. We verify the original Come Back Alive address before enabling minting.</p><label htmlFor="quantity">Number of editions</label><div className="quantity"><button aria-label="Decrease quantity" disabled={busy || amount <= 1} onClick={()=>setQuantity(String(Math.max(1, amount-1)))}>−</button><input id="quantity" type="number" min="1" max="1000" step="1" value={quantity} disabled={busy} onChange={e=>setQuantity(e.target.value)}/><button aria-label="Increase quantity" disabled={busy || amount >= 1000} onClick={()=>setQuantity(String(Math.min(1000, amount+1)))}>+</button></div>{!valid && <p role="alert">Choose a whole number between 1 and 1,000.</p>}<div className="cost"><span>Total donation</span><strong>{total} ETH</strong></div><p className="fine">{price ? `${price} ETH per edition` : 'Verifying the on-chain price…'} · Network gas is additional.</p>
 {!account ? <><button className="button full" disabled={busy} onClick={()=>connect()}>{busy ? 'Connecting…' : 'Connect wallet to mint'} ↗</button>{import.meta.env.VITE_WALLETCONNECT_PROJECT_ID && <button className="secondary full" disabled={busy} onClick={()=>connect(true)}>Mobile wallet / WalletConnect</button>}<p className="fine">On your phone, use WalletConnect or open this site inside your wallet’s browser.</p></> : <><p className="wallet">Connected: {account.slice(0,6)}…{account.slice(-4)} <button disabled={busy} onClick={()=>{cleanup.current(); wallet.current?.disconnect?.(); wallet.current=undefined; setAccount('');setHash('');setMessage('');}}>Disconnect</button></p>{chain !== 1 ? <button className="button full" disabled={busy} onClick={switchNetwork}>Switch to Ethereum Mainnet</button> : <button className="button full" disabled={busy || !valid || !eligible} onClick={mint}>{busy ? 'Transaction in progress…' : eligible ? `Mint ${valid ? amount : ''} ${amount===1?'edition':'editions'} ↗` : 'Mint currently unavailable'}</button>}</>}
 <p role="status" className={confirmed ? 'success' : 'status'}>{message}</p>{hash && <External href={`https://etherscan.io/tx/${hash}`}>View transaction on Etherscan</External>}{!eligible && <button className="retry" disabled={busy} onClick={()=>checkContract()}>Recheck mint availability</button>}
 </div></section>
 <section className="story-section" id="story"><div><p className="eyebrow">02 / WHY THIS EXISTS</p><h2>From shock<br/>to <em>solidarity.</em></h2><p className="pullquote">Turning helplessness<br/>into action.</p></div><div className="story-copy"><h3>A personal response to February 24.</h3><p>When Russia launched its full-scale invasion of Ukraine on February 24, 2022, I was in shock. This project became my first outlet: a way to turn helplessness into action, and to invite others to help.</p><p>I created UA NFT to raise funds for Come Back Alive, the Ukrainian foundation supporting the country’s defenders. The Snake Island NFT preserves a moment that gave so many of us something to hold on to: the refusal to surrender.</p><h3>The words the world heard.</h3><p>That day, Russian warships approached Snake Island in the Black Sea and demanded the Ukrainian defenders surrender. Their answer — “Russian warship, go fuck yourself” — became a symbol of Ukrainian resistance.</p><p>Early reports said the defenders had been killed. Those reports were later corrected: the defenders had been taken captive, and defenders of the island have since returned in prisoner exchanges. Their story is one of defiance, captivity, and survival.</p><p><External href="https://www.militarytimes.com/flashpoints/ukraine/2022/02/28/snake-island-ukrainians-found-alive-taken-as-russian-prisoners/">Read the corrected February 2022 reporting</External></p><h3>The story continues. So does the need.</h3><p>This project began in the first days of the invasion, among the early NFT fundraising efforts for Ukraine. Today, I’m bringing it back so that new people can discover the artwork, understand why it exists, and keep supporting Ukraine.</p><p>A film can bring a story to a new audience. This project offers a way to carry that attention into action. This fundraiser is independent; it is not an official film partnership.</p><div className="archive-links"><External href="https://web.archive.org/web/20230410215028/https://uanft.org/">Explore the original site in the Wayback Machine</External><External href="https://savelife.in.ua/en/donate-en/">Meet Come Back Alive / donate directly</External></div></div></section>
 <section className="impact-section" id="impact"><p className="eyebrow">03 / THE PUBLIC RECORD</p><div className="impact-heading"><h2>Small acts.<br/><em>Real support.</em></h2><p>Every confirmed direct mint leaves a public record on Ethereum. Follow the donations, verify the contract, and see the project’s history.</p></div><div className="stats"><div><strong>{stats?.minted ?? '—'}</strong><span>Editions minted directly</span></div><div><strong>{stats?.raised ?? '—'} <small>ETH</small></strong><span>Raised through direct mints</span></div><div><strong>{stats?.transactions ?? '—'}</strong><span>Confirmed mint transactions</span></div></div><p className="fine">{stats ? `Verified through ${new Date(stats.asOf).toLocaleString()} · Refreshes every minute.` : statsError ? 'Live totals are unavailable. You can verify the full history on Etherscan below.' : 'Loading the on-chain record…'} Counts successful publicMint calls for token #1 sent directly to this contract; excludes secondary sales and calls routed through other contracts. ETH uses actual transaction payments, not edition count multiplied by price.</p>
 {stats && <div className="table-wrap"><table><caption>Recent confirmed direct mints</caption><thead><tr><th>Date</th><th>Editions</th><th>ETH contributed</th><th>Transaction</th></tr></thead><tbody>{stats.recent.map(tx=><tr key={tx.hash}><td>{new Date(tx.date).toLocaleDateString()}</td><td>{tx.amount}</td><td>{tx.eth}</td><td><External href={`https://etherscan.io/tx/${tx.hash}`}>{tx.hash.slice(0,10)}…</External></td></tr>)}</tbody></table>{!stats.recent.length && <p>No confirmed direct mints found.</p>}</div>}
 <div className="proof"><div><span>THE ORIGINAL CONTRACT</span><External href={`https://etherscan.io/address/${CONTRACT}`}>{CONTRACT}</External></div><div><span>BENEFICIARY {recipient ? '(VERIFIED ON CHAIN)' : '(ORIGINAL ADDRESS)'}</span><External href={`https://etherscan.io/address/${recipient || BENEFICIARY}`}>{recipient || BENEFICIARY}</External></div></div><External href={`https://etherscan.io/address/${CONTRACT}#txns`}>See the full transaction history on Etherscan</External></section>
 <section className="closing"><p className="eyebrow">THE SPIRIT HASN’T CHANGED.</p><h2>Stand with Ukraine.</h2><a className="button" href="#mint">Mint with purpose ↗</a></section>
 </main><footer><a className="brand" href="#"><span className="flag"/> UA NFT</a><p>Created in solidarity. Continued with purpose.<br/>Snake Island NFT · 2022–{new Date().getFullYear()}</p><External href={OPENSEA}>OpenSea</External><External href="https://web.archive.org/web/*/https://uanft.org/">Archive</External></footer></>;
}
