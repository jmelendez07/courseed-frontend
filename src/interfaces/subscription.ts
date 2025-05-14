interface Subscription {
    id: string
    userId: string
    plan: string
    state: string
    referenceCode: string
    transaction: string
    paymentMethod: string
    currency: string
    authorizationCode: string
    responseMessage: string
    price: number
    createdAt: string
    startDate: string
    endDate: string
}

export default Subscription;