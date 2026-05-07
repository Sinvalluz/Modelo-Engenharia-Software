import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
	user: { id: string; email: string; role: string };
}

export enum Role {
	ADMIN = 'ADMIN',
	USER = 'USER',
}

export type JwtUserPayload = {
	id: string;
	email: string;
	role: string;
};
