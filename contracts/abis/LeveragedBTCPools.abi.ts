import { ABIDataTypes, BitcoinAbiTypes, OP_NET_ABI } from 'opnet';

export const LeveragedBTCPoolsEvents = [];

export const LeveragedBTCPoolsAbi = [
    {
        name: 'deposit',
        inputs: [
            { name: 'poolId', type: ABIDataTypes.UINT256 },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'withdraw',
        inputs: [{ name: 'poolId', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'withdrawAmount', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getPoolInfo',
        inputs: [{ name: 'poolId', type: ABIDataTypes.UINT256 }],
        outputs: [
            { name: 'totalDeposits', type: ABIDataTypes.UINT256 },
            { name: 'multiplier', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getUserDeposit',
        inputs: [{ name: 'poolId', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'amount', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'payForApiCall',
        inputs: [],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getTotalPools',
        inputs: [],
        outputs: [{ name: 'total', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'getApiPayments',
        inputs: [],
        outputs: [{ name: 'count', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    ...LeveragedBTCPoolsEvents,
    ...OP_NET_ABI,
];

export default LeveragedBTCPoolsAbi;
