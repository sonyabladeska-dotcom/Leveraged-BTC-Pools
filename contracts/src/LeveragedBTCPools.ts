import { u256 } from '@btc-vision/as-bignum/assembly';
import {
    OP_NET,
    Blockchain,
    Address,
    Calldata,
    BytesWriter,
    StoredU256,
    StoredU256Array,
    StoredAddressArray,
    SafeMath,
    Revert,
    EMPTY_POINTER,
} from '@btc-vision/btc-runtime/runtime';

const ZERO: u256 = u256.Zero;
const ONE: u256 = u256.One;

@final
export class LeveragedBTCPools extends OP_NET {
    // ── Pool totals ───────────────────────────────────
    private pool1TotalPtr: u16 = Blockchain.nextPointer;
    private pool1TotalStore: StoredU256 = new StoredU256(this.pool1TotalPtr, EMPTY_POINTER);

    private pool2TotalPtr: u16 = Blockchain.nextPointer;
    private pool2TotalStore: StoredU256 = new StoredU256(this.pool2TotalPtr, EMPTY_POINTER);

    private pool3TotalPtr: u16 = Blockchain.nextPointer;
    private pool3TotalStore: StoredU256 = new StoredU256(this.pool3TotalPtr, EMPTY_POINTER);

    // ── Deposit counter ───────────────────────────────
    private nextDepositIdPtr: u16 = Blockchain.nextPointer;
    private nextDepositIdStore: StoredU256 = new StoredU256(this.nextDepositIdPtr, EMPTY_POINTER);

    // ── API payments counter ──────────────────────────
    private apiPaymentsPtr: u16 = Blockchain.nextPointer;
    private apiPaymentsStore: StoredU256 = new StoredU256(this.apiPaymentsPtr, EMPTY_POINTER);

    // ── Deposit arrays (indexed by depositId) ─────────
    private depositorsPtr: u16 = Blockchain.nextPointer;
    private poolIdsPtr: u16 = Blockchain.nextPointer;
    private amountsPtr: u16 = Blockchain.nextPointer;

    // ── Reserved pointers ─────────────────────────────
    private _r01: u16 = Blockchain.nextPointer;
    private _r02: u16 = Blockchain.nextPointer;
    private _r03: u16 = Blockchain.nextPointer;
    private _r04: u16 = Blockchain.nextPointer;
    private _r05: u16 = Blockchain.nextPointer;
    private _r06: u16 = Blockchain.nextPointer;
    private _r07: u16 = Blockchain.nextPointer;
    private _r08: u16 = Blockchain.nextPointer;
    private _r09: u16 = Blockchain.nextPointer;
    private _r10: u16 = Blockchain.nextPointer;
    private _r11: u16 = Blockchain.nextPointer;
    private _r12: u16 = Blockchain.nextPointer;
    private _r13: u16 = Blockchain.nextPointer;
    private _r14: u16 = Blockchain.nextPointer;
    private _r15: u16 = Blockchain.nextPointer;
    private _r16: u16 = Blockchain.nextPointer;
    private _r17: u16 = Blockchain.nextPointer;
    private _r18: u16 = Blockchain.nextPointer;
    private _r19: u16 = Blockchain.nextPointer;
    private _r20: u16 = Blockchain.nextPointer;
    private _r21: u16 = Blockchain.nextPointer;
    private _r22: u16 = Blockchain.nextPointer;
    private _r23: u16 = Blockchain.nextPointer;
    private _r24: u16 = Blockchain.nextPointer;
    private _r25: u16 = Blockchain.nextPointer;
    private _r26: u16 = Blockchain.nextPointer;
    private _r27: u16 = Blockchain.nextPointer;
    private _r28: u16 = Blockchain.nextPointer;
    private _r29: u16 = Blockchain.nextPointer;
    private _r30: u16 = Blockchain.nextPointer;
    private _r31: u16 = Blockchain.nextPointer;
    private _r32: u16 = Blockchain.nextPointer;
    private _r33: u16 = Blockchain.nextPointer;
    private _r34: u16 = Blockchain.nextPointer;
    private _r35: u16 = Blockchain.nextPointer;
    private _r36: u16 = Blockchain.nextPointer;
    private _r37: u16 = Blockchain.nextPointer;
    private _r38: u16 = Blockchain.nextPointer;
    private _r39: u16 = Blockchain.nextPointer;
    private _r40: u16 = Blockchain.nextPointer;

    public constructor() {
        super();
    }

    public override onDeployment(_calldata: Calldata): void {
        this.pool1TotalStore.value = ZERO;
        this.pool2TotalStore.value = ZERO;
        this.pool3TotalStore.value = ZERO;
        this.nextDepositIdStore.value = ZERO;
        this.apiPaymentsStore.value = ZERO;
    }

    // ── Array helpers ─────────────────────────────────
    private getDepositors(): StoredAddressArray {
        return new StoredAddressArray(this.depositorsPtr, EMPTY_POINTER);
    }
    private getPoolIds(): StoredU256Array {
        return new StoredU256Array(this.poolIdsPtr, EMPTY_POINTER);
    }
    private getAmounts(): StoredU256Array {
        return new StoredU256Array(this.amountsPtr, EMPTY_POINTER);
    }

    private getPoolTotal(pid: u32): StoredU256 {
        if (pid == 1) return this.pool1TotalStore;
        if (pid == 2) return this.pool2TotalStore;
        if (pid == 3) return this.pool3TotalStore;
        throw new Revert('Invalid pool');
    }

    private getMultiplier(pid: u32): u256 {
        if (pid == 1) return ONE;
        if (pid == 2) return u256.fromU32(2);
        if (pid == 3) return u256.fromU32(3);
        throw new Revert('Invalid pool');
    }

    private findUserDeposit(sender: Address, poolId: u256): i32 {
        const depositors = this.getDepositors();
        const poolIds = this.getPoolIds();
        const total = this.nextDepositIdStore.value.toU64() as i32;
        for (let i: i32 = 0; i < total; i++) {
            const addr = depositors.get(i);
            const pid = poolIds.get(i);
            if (addr.equals(sender) && pid == poolId) return i;
        }
        return -1;
    }

    // ── deposit(poolId, amount) ───────────────────────
    @method(
        { name: 'poolId', type: ABIDataTypes.UINT256 },
        { name: 'amount', type: ABIDataTypes.UINT256 },
    )
    @returns({ name: 'success', type: ABIDataTypes.BOOL })
    public deposit(calldata: Calldata): BytesWriter {
        const poolId = calldata.readU256();
        const amount = calldata.readU256();
        const sender = Blockchain.tx.sender;

        const pid = poolId.toU32();
        if (pid < 1 || pid > 3) throw new Revert('Invalid pool ID');
        if (amount == ZERO) throw new Revert('Amount must be > 0');

        const existingIdx = this.findUserDeposit(sender, poolId);

        if (existingIdx >= 0) {
            const amounts = this.getAmounts();
            const current = amounts.get(existingIdx);
            amounts.set(existingIdx, SafeMath.add(current, amount));
            amounts.save();
        } else {
            const depositors = this.getDepositors();
            const poolIds = this.getPoolIds();
            const amounts = this.getAmounts();
            depositors.push(sender);
            poolIds.push(poolId);
            amounts.push(amount);
            depositors.save();
            poolIds.save();
            amounts.save();
            this.nextDepositIdStore.value = SafeMath.add(this.nextDepositIdStore.value, ONE);
        }

        const poolTotal = this.getPoolTotal(pid);
        poolTotal.value = SafeMath.add(poolTotal.value, amount);

        const writer = new BytesWriter(1);
        writer.writeBoolean(true);
        return writer;
    }

    // ── withdraw(poolId) ──────────────────────────────
    @method({ name: 'poolId', type: ABIDataTypes.UINT256 })
    @returns({ name: 'withdrawAmount', type: ABIDataTypes.UINT256 })
    public withdraw(calldata: Calldata): BytesWriter {
        const poolId = calldata.readU256();
        const sender = Blockchain.tx.sender;

        const pid = poolId.toU32();
        if (pid < 1 || pid > 3) throw new Revert('Invalid pool ID');

        const idx = this.findUserDeposit(sender, poolId);
        if (idx < 0) throw new Revert('No deposit found');

        const amounts = this.getAmounts();
        const deposited = amounts.get(idx);
        if (deposited == ZERO) throw new Revert('Already withdrawn');

        const multiplier = this.getMultiplier(pid);
        const withdrawAmount = SafeMath.mul(deposited, multiplier);

        amounts.set(idx, ZERO);
        amounts.save();

        const poolTotal = this.getPoolTotal(pid);
        poolTotal.value = SafeMath.sub(poolTotal.value, deposited);

        const writer = new BytesWriter(32);
        writer.writeU256(withdrawAmount);
        return writer;
    }

    // ── getPoolInfo(poolId) → {total, multiplier} ─────
    @method({ name: 'poolId', type: ABIDataTypes.UINT256 })
    @returns(
        { name: 'totalDeposits', type: ABIDataTypes.UINT256 },
        { name: 'multiplier', type: ABIDataTypes.UINT256 },
    )
    public getPoolInfo(calldata: Calldata): BytesWriter {
        const poolId = calldata.readU256();
        const pid = poolId.toU32();
        if (pid < 1 || pid > 3) throw new Revert('Invalid pool ID');

        const total = this.getPoolTotal(pid);
        const mult = this.getMultiplier(pid);

        const writer = new BytesWriter(64);
        writer.writeU256(total.value);
        writer.writeU256(mult);
        return writer;
    }

    // ── getUserDeposit(poolId) → amount ───────────────
    @method({ name: 'poolId', type: ABIDataTypes.UINT256 })
    @returns({ name: 'amount', type: ABIDataTypes.UINT256 })
    public getUserDeposit(calldata: Calldata): BytesWriter {
        const poolId = calldata.readU256();
        const sender = Blockchain.tx.sender;

        const idx = this.findUserDeposit(sender, poolId);
        const amount = idx >= 0 ? this.getAmounts().get(idx) : ZERO;

        const writer = new BytesWriter(32);
        writer.writeU256(amount);
        return writer;
    }

    // ── payForApiCall() → bool ────────────────────────
    @method()
    @returns({ name: 'success', type: ABIDataTypes.BOOL })
    public payForApiCall(calldata: Calldata): BytesWriter {
        this.apiPaymentsStore.value = SafeMath.add(this.apiPaymentsStore.value, ONE);

        const writer = new BytesWriter(1);
        writer.writeBoolean(true);
        return writer;
    }

    // ── getTotalPools() → 3 ──────────────────────────
    @method()
    @returns({ name: 'total', type: ABIDataTypes.UINT256 })
    public getTotalPools(calldata: Calldata): BytesWriter {
        const writer = new BytesWriter(32);
        writer.writeU256(u256.fromU32(3));
        return writer;
    }

    // ── getApiPayments() → count ─────────────────────
    @method()
    @returns({ name: 'count', type: ABIDataTypes.UINT256 })
    public getApiPayments(calldata: Calldata): BytesWriter {
        const writer = new BytesWriter(32);
        writer.writeU256(this.apiPaymentsStore.value);
        return writer;
    }
}
