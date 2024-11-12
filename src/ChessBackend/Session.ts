import Client from "./Client";
import { Request, Response, NextFunction } from "express";

const CURRENT_VERSION: number = 0;

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
    next();
}