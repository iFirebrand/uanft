# Media inventory and preservation

## Confirmed in the cloned repository

The original website played `/video.mp4`, a relative URL to a file checked into `frontend/public`. There is no friend's media-server URL in that playback code. The new site uses a smaller derivative from your own Vercel deployment. The untouched original remains committed.

| File | Purpose | SHA-256 |
| --- | --- | --- |
| `frontend/public/video.mp4` | Original ~49 MB animation | `b7b9a8c782bec751a754fe988ebc2f993ec1408b698acae68a403e5464634693` |
| `frontend/public/preview.mp4` | ~5.8 MB H.264/AAC preview, MP4 fast-start | `73fcc796d1fcb184c9302d8e5eb6c5ba0a3509a1b0079185edaa612b70a5abc0` |
| `frontend/public/artwork.jpg` | Poster extracted from original video; not claimed to be the IPFS still | `29f02cd852f9f6f77ab7796f88ac612998aab4cd50f33531f2151d8d45ed57c0` |

## NFT metadata

`frontend/src/metadata.json` identifies:

- Image: `ipfs://QmXwRMd9fCh2KXZRYqCw5C6kejE4RY8ghNZf9ExTGZbDLj`
- Animation: `ipfs://QmTzknUDPqQD328SWoJYjoCuKWLnECN6Pnw9NPeCXrXPre`

The live contract returned metadata URI `ipfs://QmYahZ8NstfK6oMCFfyhkoLJjVpQ7qYvbNynYw2a4sK8KP` in a browser-based mainnet check on September 12, 2026; see `live-contract-check.json`. The live recipient also matched the original foundation address and token #1 was enabled at 0.01 ETH.

On September 12, 2026, all three original CIDv0 UnixFS hashes were reproduced with `ipfs-only-hash`:

- The live metadata was retrieved and backed up in `preservation/ipfs/metadata.json`; its CID matches the contract URI, and its parsed contents match the original checked-in metadata.
- The image was retrieved independently from dweb.link and Pinata's public gateway and backed up in `preservation/ipfs/image.png`; its reproduced CID matches the metadata.
- The untouched original `frontend/public/video.mp4` reproduces the animation CID exactly. It is the original NFT animation, not merely a similar website copy.

See `preservation/manifest.json` for file sizes, CIDs, and SHA-256 checksums. All assets can now be re-pinned from exact local bytes without changing the NFT or smart contract. Retrieval and exact backups are verified; current pin ownership and ongoing retention are not.

## Verify and preserve the NFT itself

Run `node scripts/inspect-media.mjs`, optionally with `ETHEREUM_RPC_URL` set to a working mainnet provider. It reads `uri(1)` and the current recipient directly from the original contract and fetches the metadata. Alternatively use Etherscan's Read Contract tab for `uri(1)`.

Exact metadata, image, and animation bytes are already preserved in this repository. Keep an additional offline copy and import **each original CID** into an IPFS pinning account you control, ideally with a second independent pin. Verify each CID remains accessible. Do not recompress the original IPFS content: changed bytes produce a different CID. Our preview is a website derivative only.

Pinning requires a pinning service/account or an IPFS node; none has been connected in this session. Committing the existing video secures website playback, but does not by itself keep OpenSea's IPFS assets online. There is no need to change or redeploy the smart contract to pin the original content.
