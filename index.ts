import cors from 'cors';
import express, { Response, Request, NextFunction } from 'express';
import { IPortFrontend } from './src/interfaces/IPortFrontEnd.interface';
import path from "path";
import BrowserRouter from './src/routes/indexRoute.config';
import MySQL from './src/config/ConnectionMysql.config';

let portsFrontend: IPortFrontend[] = [
    {
        id: 0,
        name: "Angular",
        port: 4200
    },
    {
        id: 1,
        name: "React and Vue.js using Vite",
        port: 5173
    },
    {
        id: 2,
        name: "Vue.js",
        port: 8080
    },
    {
        id: 3,
        name: "Create React App and Next.JS",
        port: 3000
    },
    {
        id: 4,
        name: "Svelte",
        port: 3000
    },
    {
        id: 5,
        name: "Ember.js",
        port: 4200
    },
    {
        id: 6,
        name: "Nuxt.js",
        port: 3000
    },
    {
        id: 7,
        name: "Quasar (Vue.js)",
        port: 3000
    },
    {
        id: 8,
        name: "Gatsby",
        port: 8080
    }
];

let originUrlFront: string = `http://localhost:${portsFrontend[1].port}`;

let portBackend: number = 3500;

const mySQL = new MySQL();

const app: any = express();

const publicFolder: any = express.static(path.resolve(__dirname, './src/public'));

app.use(express.json());

app.use(cors({ origin: originUrlFront }));

app.use((_req: Request, _res: Response, next: NextFunction) => {
    _res.header('Access-Control-Allow-Origin', '*');
    _res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use('/api', BrowserRouter);

const startServer = async () => {
    try {
        await mySQL.getSequelizeInstance().sync(); // Sincroniza los modelos
        app.listen(portBackend, (): void => {
            console.info("Connect Express with port: " + portBackend);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
};

startServer();
