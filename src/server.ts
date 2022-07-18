import "express-async-errors";
import express from "express";
import { routes } from "./routes";
import { Request, Response, NextFunction } from "express-serve-static-core";
import { AppError } from "./error/AppError";



const app = express();

app.use(express.json());

app.use(routes);

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if(err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: "error",
            message: err.message
        })
    }

    return response.status(500).json({
        status: "error",
        message: `Internal server error - ${err.message}`
    })
})

app.listen(4003, () => console.log("Server is running pn PORT 4003"));