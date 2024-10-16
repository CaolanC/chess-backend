"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NetworkManager_1 = require("./ChessBackend/NetworkManager");
const manager = new NetworkManager_1.ChessBackend.SessionManager();
manager.start();
