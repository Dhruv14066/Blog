import express from "express";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";
dotenv.config({
    path : './env'
})

connectDB()
.then(() => {
    app.on("error",(error)=>{
        console.log("Error : ", error);
        throw error;
    })
    app.listen(process.env.port || 8000, () => {
            console.log(`application is runing at port :  ${process.env.PORT}`)
        })
    })
.catch((error) => {
    console.log("MongoDB connection failed !!!!", error);
})
