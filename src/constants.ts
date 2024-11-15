// perhaps express has functionality to automate the resolving of paths?
import path from 'path';
export const PUBLIC_DIR = process.env["PUBLIC_DIR"] || path.resolve(__dirname, "..", "public");
export const SECRET_KEY = process.env["SECRET_KEY"] || "totally_secret_key_use_in_prod";