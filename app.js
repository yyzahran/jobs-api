require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
// extra security packages
const helmet = require('helmet');
const cors = require('cors')
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
// swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDoc = YAML.load('./swagger.yaml')

// connectDB
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')

// router
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages - security
app.set('trust proxy', 1) // for rateLimier to trust Heroku
app.use(rateLimiter({
  windowMS: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
}));
app.use(helmet());
app.use(cors());
app.use(xss());

app.get('/', (req, res) => {
  res.send("jobs api")
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc))

// routes
app.use('/api/v1/auth', authRouter)
// adding authenticateUser in front of all our jobs routes will add req,user property on every /jobs request
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
