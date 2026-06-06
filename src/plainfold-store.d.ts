declare module '@plainfold/store' {
  export const Settings: {
    get<T>(key: string): Promise<T | undefined>
    set<T>(key: string, value: T): Promise<void>
  }
  export function clearAll(): Promise<void>
}
