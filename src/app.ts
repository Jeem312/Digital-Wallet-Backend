import cors from "cors";
import express, { Request, Response } from "express";
import { globalErrorHandler } from "./middleWares/globalErrorHandler";
import {notFoundHandler }from "./middleWares/notFound";
import { router } from "./app/routes/index";
import { envVars } from "./config/envConfig";

const app = express()

app.use(express.json())
app.use(cors({
    origin:envVars.FRONTEND_URL,
    credentials:true
}))
app.set("trust proxy",1)

app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Digital Wallet Backend "
    })
})


app.use(globalErrorHandler)

app.use(notFoundHandler)

export default app