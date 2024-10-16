import { v4 as uuidv4 } from 'uuid';
import express, { Request, Response } from 'express';  // Import Request and Response
import path from 'path';

require('dotenv').config();

const cookieParser = require('cookie-parser');

const app = express();

const MAX_PLAYERS = 2;

export namespace ChessBackend
{
    class Player
    {
      public readonly Name: string;
      private readonly ClientID: string;

      constructor(name: string = "Guest") {
        this.Name = name;
        this.ClientID = uuidv4();
      }

      public getID() {
        return this.ClientID;
      }
    }

    class Session
    {

        public readonly ID: string;
        private readonly Engine_Manager: EngineManager;
        private readonly Players: Player[];

        constructor() {
            this.ID = this._generateSessionId();
            this.Engine_Manager = new EngineManager();
            this.Players = [];
        }

        public addPlayer(player: Player): boolean {

          if (!(this.isJoinable())) {
            return false;
          }

          this.Players.push(player);
          return true;
        }

        public isJoinable(): boolean {
          return this.Players.length >= MAX_PLAYERS;
        }

        public getID(): string {
          return this.ID;
        }

        private _generateSessionId(): string {
          return uuidv4();
        }
    }

    class EngineManager
    {
        constructor() {
            
        }
    }

    export class SessionManager
    {
        public Sessions: { [key: string]: Session };
        private SecretKey: string;

        constructor(secret_key: string = "lol") {
          this.Sessions = {};
          this.SecretKey = secret_key;
        }

        public start(): void {

          app.use(express.static(path.join(__dirname, '..', '..', 'front', 'public')));
          app.use(cookieParser());

          app.get('/', (req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, '..', '..', 'front', 'public', 'index.html'));
          });

          app.post('/create-game', (req: Request, res: Response) => {
            const new_session = new Session();
            const game_url = new_session.getID();


            let player: Player = new Player();
            new_session.addPlayer(player);
            this.Sessions[game_url] = new_session;

            const player_id = player.getID();
            res.cookie('clientInfo', {player_id, game_url}, {
              httpOnly: true,
              secure: true,
              sameSite: 'strict',
              maxAge: 24 * 60 * 60 * 1000
            });

            res.redirect(`/game/${game_url}`);
          });

          app.get('/game/:game_url', (req: Request, res: Response) => {
            
            const url = req.params.game_url;
            if (!(this._url_exists(url))) {
              res.json({nah: "Nah"});
            }

            else {
              res.sendFile(path.join(__dirname, '..', '..', 'front', 'public', 'game.html'));
            }

          });

          app.listen(3000, () => {
            console.log('Server is running on port 3000');
          });
        }

        private _url_exists(url: string): boolean {
        
          const keys = Object.keys(this.Sessions);
          // console.log(keys);
          return keys.some(key => {
            return key === url;
          });
        }
    }

}

