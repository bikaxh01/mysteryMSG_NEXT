export interface ApiResponse {
    success: boolean,
    message: string,
    isAceepting?: boolean,
    data?: object,
    messages?: Array<Message>
}

interface Message {
    content: string,
    createdAt : Date
}