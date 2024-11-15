// TODO would love to get rid of this file
// perhaps express has functionality to automate the resolving of paths?
import path from 'path';
export const publicDir = path.resolve(__dirname, "..", "public"); // TODO turn this into an ENV variable