declare global {
  export interface AsyncVoidFunction {
    (): Promise<void>;
  }

  export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>;

  export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;
}

export default global;
