import { CONTRACT, summarize } from '../lib/stats-core.js';
export default async function handler(req, res) {
 res.setHeader('Cache-Control', 'no-store');
 if (req.method !== 'GET') return res.status(405).json({error:'Method not allowed'});
 if (!process.env.ETHERSCAN_API_KEY) return res.status(503).json({error:'Live statistics are not configured'});
 const query = async params => {
  const url = new URL('https://api.etherscan.io/v2/api'); url.search = new URLSearchParams({chainid:'1',apikey:process.env.ETHERSCAN_API_KEY,...params});
  const response = await fetch(url,{signal:AbortSignal.timeout(12000)}); if (!response.ok) throw Error('Explorer unavailable');
  return response.json();
 };
 try {
  // Freeze the block range so new transactions cannot shift paginated results.
  const head = await query({module:'proxy',action:'eth_blockNumber'});
  if (!/^0x[0-9a-f]+$/i.test(head.result)) throw Error('Invalid explorer response');
  const endblock = String(parseInt(head.result,16)); const transactions=[]; let complete=false;
  for (let page=1;page<=50;page++) {
   const data = await query({module:'account',action:'txlist',address:CONTRACT,startblock:'0',endblock,page:String(page),offset:'1000',sort:'asc'});
   if (data.status === '0' && data.message === 'No transactions found' && Array.isArray(data.result)) {complete=true;break;}
   if (data.status !== '1' || !Array.isArray(data.result)) throw Error('Explorer unavailable');
   transactions.push(...data.result); if (data.result.length<1000) {complete=true;break;}
   await new Promise(resolve=>setTimeout(resolve,350));
  }
  if (!complete) throw Error('Incomplete history');
  const block = await query({module:'proxy',action:'eth_getBlockByNumber',tag:head.result,boolean:'false'});
  if (!block.result?.timestamp) throw Error('Missing block timestamp');
  const summary=summarize(transactions,new Date(parseInt(block.result.timestamp,16)*1000).toISOString());
  res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=120'); return res.status(200).json(summary);
 } catch { return res.status(502).json({error:'Could not verify the complete mint history. Please use Etherscan.'}); }
}
