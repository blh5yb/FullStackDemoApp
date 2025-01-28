// Load environment variables
import "./loadEnvironment.js";
import helmet from "helmet";
import express from 'express'; 
import bodyParser from 'body-parser';
import connectDb from "./db/conn.js";
import serverless from 'serverless-http';
import swaggerUi from  'swagger-ui-express';
import { appSecret, appSession, port, swaggerDocs, isDev, allowedOrigins } from "./config.js";
import cors from 'cors';
import session from "express-session";
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser())
//import cors from 'cors';
const corsOptions = {
  origin: allowedOrigins,
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions))  // can use as middleware on certain routes
//app.use(express.json());

// some extra security
app.use(session({
  name: appSession,
  secret: appSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {secure: true}  // Ensure cookies are only sent over HTTPS
}))


// Use Helmet for securing HTTP headers
if (!isDev){
  app.use(helmet()); 
  app.use((req, res, next) => {  // redirect to https
    if (!req.secure) {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

//app.use(bodyParser.json())
/**
 * @swagger
 * /:
 *   get:
 *     description: Prints Hello world
 *     summary: Hello World
 *     tags:
 *       - API Entry Point
 *     responses:
 *       200:
 *         description: API is working
 */

import authRouter from "./routes/authRoutes.js";
app.use('/express_auth', authRouter);

await connectDb()
app.get('/', () => {
  res.send({test: "Hello world"})
})
app.listen(port, () => {
  console.log(`Server is listening on port, ${port}`);
})

export const handler = serverless(app)
//export default app