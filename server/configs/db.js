import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const connectDB = async ()=> {
    try{
        mongoose.connection.on("connected",
            () => console.log("Database Connected"))
        await mongoose.connect(`${process.env.MONGODB_URI}/ssvbp`)


        const adminEmail = "admin@venuego.com";
        const existingAdmin = await User.findOne({email: adminEmail, role: "admin"});


        if(!existingAdmin) {
            const hashed = await bcrypt.hash("Admin@123", 10);
            await User.create({
                name: "Super Admin",
                email: adminEmail,
                password: hashed,
                role: "admin",

            });

            console.log("Default admin created.");
        }
         else if (existingAdmin.role !== "admin"){
            existingAdmin.role = "admin";
            await existingAdmin.save();
         }

        else {
            console.log("Admin already exists");
        }
    } catch(error){

        console.log(error.message);

    }
}


export default connectDB;