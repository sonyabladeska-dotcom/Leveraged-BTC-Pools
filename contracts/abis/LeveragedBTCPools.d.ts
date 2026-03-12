import { Address, AddressMap, ExtendedAddressMap, SchnorrSignature } from '@btc-vision/transaction';
import { CallResult, OPNetEvent, IOP_NETContract } from 'opnet';

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Call Results
// ------------------------------------------------------------------

/**
 * @description Represents the result of the deposit function call.
 */
export type Deposit = CallResult<
    {
        success: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the withdraw function call.
 */
export type Withdraw = CallResult<
    {
        withdrawAmount: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getPoolInfo function call.
 */
export type GetPoolInfo = CallResult<
    {
        totalDeposits: bigint;
        multiplier: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getUserDeposit function call.
 */
export type GetUserDeposit = CallResult<
    {
        amount: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the payForApiCall function call.
 */
export type PayForApiCall = CallResult<
    {
        success: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getTotalPools function call.
 */
export type GetTotalPools = CallResult<
    {
        total: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the getApiPayments function call.
 */
export type GetApiPayments = CallResult<
    {
        count: bigint;
    },
    OPNetEvent<never>[]
>;

// ------------------------------------------------------------------
// ILeveragedBTCPools
// ------------------------------------------------------------------
export interface ILeveragedBTCPools extends IOP_NETContract {
    deposit(poolId: bigint, amount: bigint): Promise<Deposit>;
    withdraw(poolId: bigint): Promise<Withdraw>;
    getPoolInfo(poolId: bigint): Promise<GetPoolInfo>;
    getUserDeposit(poolId: bigint): Promise<GetUserDeposit>;
    payForApiCall(): Promise<PayForApiCall>;
    getTotalPools(): Promise<GetTotalPools>;
    getApiPayments(): Promise<GetApiPayments>;
}
