import { createWriteStream } from "fs";
import { join } from "path";
import { EventEmitter } from "stream";




const target = join(process.cwd(), "a.txt");
const ws = createWriteStream(target);
console.log(ws instanceof EventEmitter)