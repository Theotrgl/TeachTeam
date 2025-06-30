import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/user.routes";
import profileRoutes from "./routes/profile.routes";
import courseRoutes from "./routes/course.routes";
import tutorRoutes from "./routes/tutor.routes";
import tutorOrderRoutes from "./routes/tutorOrder.routes";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", profileRoutes)
app.use("/api/", courseRoutes);
app.use("/api/", tutorRoutes);
app.use("/api/", tutorOrderRoutes)

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) =>
    console.log("Error during Data Source initialization:", error)
  );
