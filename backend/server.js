const app = require('./app');
const connectDatabase = require('./config/database');

const dotenv = require('dotenv');

// Handle Uncaught exceptions
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down due to uncaught exception');
    process.exit(1);
})

//setting up config file 
dotenv.config({ path : 'config/config.env' });

// Connecting to Database
connectDatabase();

const server = app.listen(process.env.PORT, ()=> {
    console.log(`server started on PORT : ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
})

// Handle Unhadled Promise Rejections
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.stack}`);
    console.log('Shutting down the server due to unhandled Promise rejection');
    server.close(() => {
        process.exit(1)
    });
})