// The size of the target zone
export const TARGET_ZONE_SIZE = 5;

// How many addresses/couples to put into a database
// insertion query before running it
export const UPLOAD_EVERY_NTH_ITEMS = 5000;

// The number of couples that will be searched in a single database query
export const SEARCH_EVERY_N_COUPLES = 5000;

// Dictates how picky the selection cutoff is when comparing the total hit
// numbers of potential tracks. 
// 0 = every potential track is selected
// 1 = only clips who have all their target zones match
// Range: [0, 1]
export const SEARCH_SELECTION_COEFFICIENT = 0.8;