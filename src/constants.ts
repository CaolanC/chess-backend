// perhaps express has functionality to automate the resolving of paths?
import path from 'path';
export const PUBLIC_DIR: string = process.env["PUBLIC_DIR"] || path.resolve(__dirname, "..", "public");
export const SECRET_KEY: string = process.env["SECRET_KEY"] || "totally_secret_key_use_in_prod";
export const PROD: boolean = process.env["NODE_ENV"] === "production";
// least ugly oneliner... use $PORT if it exists, or 80/5299 as a default
export const PORT: number = !!process.env["PORT"] ? Number.parseInt(process.env["PORT"]) : (PROD ? 80 : 5299);