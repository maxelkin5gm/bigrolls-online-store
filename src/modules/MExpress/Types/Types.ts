import {IncomingMessage, ServerResponse} from "http";


export interface Request extends IncomingMessage {
    cookie: { [key: string]: string }
    url_parts: URL
    json?: any,
    formData?: any
}

export interface Response extends ServerResponse {
    redirect(statusCode: number, url: string): void
}

export type routerCB = (req: Request, res: Response) => void

export type middleware = (req: Request, res: Response, next: () => void) => void

export type nextFunction = () => void

export type routers = {
    [key: string]: { [key: string]: routerCB }
}

export type dataToken = {[key: string]: any}