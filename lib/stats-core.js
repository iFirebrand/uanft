import * as utils from 'ethers';
export const CONTRACT = '0xd084B091bAf94154D782f78EB9f904A76d8F741a';
const iface = new utils.Interface(['function publicMint(uint256 tokenId,uint256 amount) payable']);
export function summarize(transactions, asOf) {
 const unique = new Map();
 for (const tx of transactions) {
  if (tx.to?.toLowerCase() !== CONTRACT.toLowerCase() || tx.isError !== '0' || tx.txreceipt_status !== '1') continue;
  try { const decoded = iface.parseTransaction({data:tx.input}); if (decoded.args.tokenId !== 1n) continue; unique.set(tx.hash, {...tx, amount:decoded.args.amount}); } catch { /* Non-mint transactions are excluded. */ }
 }
 const mints = [...unique.values()].sort((a,b)=>Number(b.blockNumber)-Number(a.blockNumber) || Number(b.transactionIndex)-Number(a.transactionIndex));
 return {minted:mints.reduce((sum,tx)=>sum+BigInt(tx.amount.toString()),0n).toString(),raised:utils.formatEther(mints.reduce((sum,tx)=>sum+BigInt(tx.value),0n).toString()),transactions:mints.length,asOf,recent:mints.slice(0,10).map(tx=>({hash:tx.hash,amount:tx.amount.toString(),eth:utils.formatEther(tx.value),date:new Date(Number(tx.timeStamp)*1000).toISOString()}))};
}
