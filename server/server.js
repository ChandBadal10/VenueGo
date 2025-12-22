import express from "express"
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js"
import venueRouter from "./routes/venueRoutes.js";
import addVenueRouter from "./routes/addVenueRoutes.js";



// Initialize Express App
const app = express()
await connectDB()

const allowedOrigins = ["http://localhost:5173"]

// Middleware
app.use(cors({origin: allowedOrigins, credentials: true}));
app.use(express.json());



app.get("/", (req,res)=> res.send("Server is running"))


app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/venue", venueRouter);
app.use("/api/addvenue", addVenueRouter);




const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))