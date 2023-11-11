const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user.routes");
const PORT = process.env.PORT || 8080;

const app = express();

// Додайте cors middleware перед вашими маршрутами
app.use(cors());

app.use(express.json());
app.use("/api", userRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT} `));
