require('express-async-errors');
require('dotenv').config({ path: './env/.env' })
const cors = require('cors');
const seed = require('./db/seed');

const helmet = require('helmet');
const express = require ("express");
const app = express();
app.use(cors({
  origin: '*'
}));
const port= process.env.PORT || 3000;
const uri = process.env.MONGO_URI || "mongodb://mongo:27017";

const connectDB = require('./db/dbConnect')
const scores = require("./routes/scores")
const xss = require('xss-clean');
const errorHandler = require('./middleware/errorHandlerMiddleware')

//middleware
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'], 
        
      },
    })
  );
app.use(xss())
app.use(express.json())


app.use('/api/v1/scores', scores)

app.use(errorHandler);

const start = async () =>{
    try {
        await connectDB(uri);
        app.listen(port, console.log(`server is listening to port: ${port}...`));
        seed();
    } catch (error) {
        console.log(error);
    }
}

start();
