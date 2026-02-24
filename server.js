require("dotenv").config();
const express = require("express");
const connectDB = require("./db/db");
const authRoutes = require("./routes/auth.routes.js");
const homeRoutes = require("./routes/home.routes.js");
const adminRoutes = require("./routes/admin.routes.js");
const imageRoutes = require("./routes/image.routes.js");
const app = express();

app.use(express.json());

connectDB();

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/home", homeRoutes);
app.use("/api/v1/image", imageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
