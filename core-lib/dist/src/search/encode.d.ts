import { Address, Couple } from "./types";
export declare function encodeAddress({ anchorFreq, pointFreq, delta }: Address): number;
export declare function decodeAddress(address: number): Address;
export declare function encodeCouple({ absTime, trackId }: Couple): bigint;
export declare function decodeCouple(couple: bigint): Couple;
