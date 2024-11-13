import Client from "./ChessBackend/Client";
import { Request, Response, NextFunction } from "express";

const CURRENT_VERSION: number = 0;

declare module 'express' {
    interface Request {
        user?: Client;
    }
}

// middleware to maintain a valid user session
export default function validateSession(req: Request, res: Response, next: NextFunction): void {
    if (!req.session) {
        res.status(500).send("No session?");
        return;
    }

    if (!req.session.user || req.session.version !== CURRENT_VERSION) {
        req.session.user = new Client();
        req.session.version = CURRENT_VERSION;
    }
    req.user = req.session.user;
    next();
}