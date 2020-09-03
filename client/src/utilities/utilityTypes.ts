// Additional TypeScript utility types

// Source: https://stackoverflow.com/questions/54607400/typescript-remove-entries-from-tuple-type
export type RemoveFirstFromTuple<T extends any[]> = 
  T['length'] extends 0 ? undefined :
  (((...b: T) => void) extends (a: any, ...b: infer I) => void ? I : []);