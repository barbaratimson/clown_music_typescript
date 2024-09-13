export interface UserT {
    account: AccountT
}

export interface AccountT {
    uid: number,
    login: string
    registeredAt: string
    displayName: string
    firstName: string
    secondName: string
}
