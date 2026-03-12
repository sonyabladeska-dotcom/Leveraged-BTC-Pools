import { getContract, ABIDataTypes, BitcoinAbiTypes, type BaseContractProperties, type BitcoinInterfaceAbi } from 'opnet';
import { Address } from '@btc-vision/transaction';

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';
export const DEFAULT_FEE_RATE = 10;
export const MAX_SAT_PER_TX = BigInt(100000);

const ABI: BitcoinInterfaceAbi = [
    // Write methods
    {
        name: 'deposit', type: BitcoinAbiTypes.Function,
        inputs: [{ name: 'poolId', type: ABIDataTypes.UINT256 }, { name: 'amount', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    {
        name: 'withdraw', type: BitcoinAbiTypes.Function,
        inputs: [{ name: 'poolId', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'withdrawAmount', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'payForApiCall', type: BitcoinAbiTypes.Function,
        inputs: [],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
    },
    // Read methods
    {
        name: 'getPoolInfo', type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [{ name: 'poolId', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'totalDeposits', type: ABIDataTypes.UINT256 }, { name: 'multiplier', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'getUserDeposit', type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [{ name: 'poolId', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'amount', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'getTotalPools', type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'total', type: ABIDataTypes.UINT256 }],
    },
    {
        name: 'getApiPayments', type: BitcoinAbiTypes.Function,
        constant: true,
        inputs: [],
        outputs: [{ name: 'count', type: ABIDataTypes.UINT256 }],
    },
];

export interface ILeveragedContract extends BaseContractProperties {
    deposit(poolId: bigint, amount: bigint): Promise<any>;
    withdraw(poolId: bigint): Promise<any>;
    getPoolInfo(poolId: bigint): Promise<any>;
    getUserDeposit(poolId: bigint): Promise<any>;
    payForApiCall(): Promise<any>;
    getTotalPools(): Promise<any>;
    getApiPayments(): Promise<any>;
}

export function getLeveragedContract(provider: any, network: any, senderPubKey?: string): ILeveragedContract {
    if (!CONTRACT_ADDRESS) {
        throw new Error('Contract address not configured. Set VITE_CONTRACT_ADDRESS in .env');
    }

    let senderAddress: Address | undefined;
    if (senderPubKey) {
        try {
            senderAddress = Address.fromString(senderPubKey);
        } catch {
            senderAddress = undefined;
        }
    }

    return getContract<ILeveragedContract>(
        CONTRACT_ADDRESS,
        ABI,
        provider,
        network,
        senderAddress,
    );
}
