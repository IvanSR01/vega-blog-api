declare type JWTTokenPayload = {
	exp?: any
	email: string
	sub: number
}

declare type SocketPayload = { content: string; chatId: number; userId: number }
