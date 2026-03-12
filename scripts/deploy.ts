import { CONFIG } from './config';

async function deploy() {
    console.log('=== Leveraged BTC Pools — Contract Deployment ===');
    console.log(`Network: ${CONFIG.NETWORK}`);
    console.log(`RPC: ${CONFIG.RPC_URL}`);
    console.log(`WASM: ${CONFIG.WASM_PATH}`);
    console.log('');
    console.log('Steps:');
    console.log('1. cd contracts && npm run build');
    console.log('2. Upload build/LeveragedBTCPools.wasm via OP_NET deployer');
    console.log('3. Connect OP_WALLET → deploy to testnet');
    console.log('4. Copy address to frontend/.env → VITE_CONTRACT_ADDRESS');
}

deploy().catch(console.error);
