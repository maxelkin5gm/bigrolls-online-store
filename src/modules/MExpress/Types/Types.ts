import { IncomingMessage, ServerResponse } from 'http';

export interface Request extends IncomingMessage {
  cookie: { [key: string]: string }
  url_parts: URL
  json?: any,
  formData?: any
}

export interface Response extends ServerResponse {
  redirect(statusCode: number, url: string): void
}

export type RouterCB = (req: Request, res: Response) => void;

export type Middleware = (req: Request, res: Response, next: () => void) => void;

export type NextFunction = () => void;

export type Routers = {
  [key: string]: { [key: string]: RouterCB }
};

export type DataToken = { [key: string]: any };
