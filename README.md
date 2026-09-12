# Snake Island / UA NFT

A mobile-friendly revival of the original 2022 NFT fundraiser supporting Come Back Alive. The deployed Ethereum contract and token #1 remain unchanged. Original upstream: https://github.com/jonson/uanft.

## Run locally

Node 22.12+ (Node 24 recommended).

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:5173. `npm run build` checks TypeScript and builds production assets. `npm test` verifies fundraising accounting. With the dev server running, `npx playwright install chromium` and `node tests/browser.mjs` check responsive layout and simulated wallet minting. Browser tests use mocked chain responses and never spend ETH.

## Deploy on Vercel

Import https://github.com/iFirebrand/uanft as a new Vercel project. Keep **Root Directory at the repository root**, select **Vite**, and use the checked-in settings: `npm run build`, output `dist`. The root `api/stats.js` becomes a serverless function. Node 24 is suitable.

Set these environment variables for Production and Preview, then deploy:

| Variable | Purpose |
| --- | --- |
| `ETHERSCAN_API_KEY` | Server-only Etherscan V2 key for mainnet transaction history and dated totals. |
| `VITE_WALLETCONNECT_PROJECT_ID` | Reown/WalletConnect project ID for mobile wallet pairing; allowlist the Vercel and eventual custom domains in its dashboard. This ID is public. |
| `VITE_ETHEREUM_RPC_URL` | Browser-accessible Ethereum mainnet RPC with CORS. Defaults to `https://ethereum.publicnode.com`; verify it works from the deployed domain or provide a dedicated provider. Any credential embedded here is public and should be domain-restricted. |

Without the Etherscan key, the dashboard displays unavailable totals and links to Etherscan. Without a WalletConnect project ID, injected desktop wallets and mobile wallet browsers work, but external mobile-wallet pairing is unavailable. Vite variables require a rebuild after changing.

The browser reads the live price, mint status, and beneficiary. Minting is enabled only when token #1 is enabled and the beneficiary matches the original foundation address. It rechecks these conditions before requesting a transaction. Payment is integer wei arithmetic: current price × edition quantity. Gas is additional. Transactions are submitted only on the user's explicit click and wallet approval.

Before promoting the fundraiser, verify the current recipient against Come Back Alive's current donation information and do a real wallet mint smoke test. A browser-based live check on September 12, 2026 confirmed token #1 is enabled at 0.01 ETH and the recipient matches the original address; see `docs/live-contract-check.json`. The metadata URI was verified on chain, but IPFS content retrieval and pinning remain unverified. No real mint was submitted during development.

## Fundraising accounting

Totals cover successful **direct** `publicMint(1, amount)` transactions into the original contract. The API freezes a block range, paginates its complete normal-transaction history, deduplicates hashes, and sums actual transaction ETH values and edition quantities. It returns the timestamp of the snapshot block, caches for 60 seconds, and the page refreshes every minute. Explorer failures or incomplete history return unavailable totals rather than a partial figure.

This scope excludes routed smart-wallet/contract calls and secondary-market sales. A complete total including routed mints requires indexing ERC-1155 mint logs and internal ETH transfers; direct totals are explicitly labelled on the page. Historical mint quantity cannot be used to infer ETH raised: the existing contract's payment check permits multi-edition mints at less than the advertised per-edition total. The new frontend pays the full displayed price without changing the deployed contract.

## Media preservation

See [docs/media-preservation.md](docs/media-preservation.md). Website playback uses assets committed to this repo and served by your own deployment. OpenSea metadata is a separate dependency and must be verified and pinned independently.

## Editorial notes

The expanded founder narrative follows the owner's account of responding to the invasion. The page corrects the original site's early reports about the defenders' deaths. It uses “among the early NFT fundraising efforts for Ukraine”; “first ever” needs evidence and a clearly defined scope before publication. No film title, release date, official affiliation, or partnership has been invented.

References: [original OpenSea item](https://opensea.io/item/ethereum/0xd084B091bAf94154D782f78EB9f904A76d8F741a/1), [April 2023 archived site](https://web.archive.org/web/20230410215028/https://uanft.org/), [corrected February 2022 reporting](https://www.militarytimes.com/flashpoints/ukraine/2022/02/28/snake-island-ukrainians-found-alive-taken-as-russian-prisoners/), [Come Back Alive donations](https://savelife.in.ua/en/donate-en/).
