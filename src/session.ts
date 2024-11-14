import Client from "./ChessBackend/Client";
import { Request, Response, NextFunction } from "express";

declare module 'express-serve-static-core' {
    interface Request {
        user?: Client;
    }
}

const CURRENT_VERSION: number = 0; // bump this any time we change the layout of Client

// middleware to maintain a valid user session
// adds req.user, which is strictly a Client (and not a JSON object with its data. fuck JS)
export default function enforceSession(req: Request, res: Response, next: NextFunction): void {
    if (!req.session) {
        res.status(500).send("No session?");
        return;
    }

    if (!req.session.user || req.session.version !== CURRENT_VERSION) {
        req.session.user = new Client();
        req.session.version = CURRENT_VERSION;
    } else {
        req.session.user = Client.copy(req.session.user);
    }
    req.user = req.session.user;
    next();
}