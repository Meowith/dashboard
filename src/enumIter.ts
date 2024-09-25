export function enumKeys<O extends object>(obj: O): (keyof O)[] {
    return Object.keys(obj).filter(k => Number.isNaN(Number(k))) as (keyof O)[]
}

export function enumValues<O extends object>(obj: O): O[] {
    return enumKeys(obj).map(x => obj[x] as O)
}

export function enumValBit<E extends number>(e: E): number {
    return 1 << ((e as number) - 1)
}

export function enumBit<E extends object>(e: E, k: keyof E): number {
    return 1 << ((e[k] as number) - 1)
}