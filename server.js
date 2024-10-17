const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const config = require("./config");
const { logger } = require("./logger");
const connectDB = require("./config/db");
const routes = require("./routes/index");
const { errorHandler } = require("./middlewares/error.middlewares");

const app = express();

//connect to MongoDB
connectDB();

//morgan logging format
const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.use(cors());
app.use(express.json());
app.use("/", routes);

app.use(errorHandler);
app.listen(config.port, () => {
  console.log(`Server is Listening on port ${config.port}`);
});
