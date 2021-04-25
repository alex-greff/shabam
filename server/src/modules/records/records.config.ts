// The number of points between an anchor point and its target zone
// TODO: This should be the number of partitions - 1 and not hardcoded
// This avoids any possibilities of having time deltas of 0 since the
// anchor point is guaranteed to be in a different window than all the points
// in the target zone
// export const ANCHOR_POINT_GAP = 3; 

// The size of the target zone
export const TARGET_ZONE_SIZE = 5;