import Client from "./ChessBackend/Client";
import { Request, Response, NextFunction } from "express";

declare module 'express-serve-static-core' {
    interface Request {
        user?: Client;
    }
}

const CURRENT_VERSION: number = 0;

// middleware to maintain a valid user session
// adds req.user
export default function enforceSession(req: Request, res: Response, next: NextFunction): void {
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