import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import routes from './routes/index.js';
import { resendOTP } from './controllers/Auth.controllers.js';

const app = express();

const corsOptions = {
  origin: [
    'https://freaky-web-vendor-new.vercel.app/',
    'http://localhost:5173',
    'https://dev.vendor.freakychimp.com/',
    'https://dev.admin.freakychimp.com/',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/', (req, res, next) => {
  console.log('path: ', req.path);
  next();
});

app.post('/aadmindetail', resendOTP);

app.use('/', routes);

app.use((req, res, next) => {
  res.status(404).send({ message: 'Not FOUND' });
});

export const handler = serverless(app);
