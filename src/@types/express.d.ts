import Client from "../ChessBackend/Client";
import Room from "../ChessBackend/Room";

import express from "express";

declare module 'express' {
    interface Request {
        user?: Client;
        room?: Room;
    }
}
