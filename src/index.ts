import * as express from 'express';
import {Edge} from 'edge.js';
import { join } from 'node:path';
import * as process from "node:process";
import {NextFunction, Request, Response} from "express";

const app = express();
const edge = new Edge();
edge.mount(join(process.cwd(), 'views'));

import indexRoute from './routes';

app.use(function (req: Request, res: Response, next: NextFunction) {
    res.render = async function (view: string, data: Record<string, any>) {
        const template = await edge.render(view, data);
        res.send(template);
    }
    next();
});

app.use('/', indexRoute);

app.listen(3100, () => {
    console.log('Example app listening on port 3100!');
});