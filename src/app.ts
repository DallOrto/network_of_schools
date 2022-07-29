import "express-async-errors";
import express from "express";
import { routes } from "./routes";
import { Request, Response, NextFunction } from "express-serve-static-core";
import { AppError } from "./error/AppError";

export const app = express();

app.use(express.json());

app.use(routes);

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if(err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: "error",
            message: err.message
        })
    }

    return response.status(400).json({
        status: "error",
        message: `Bad Request - ${err.message}`
    })

    return response.status(401).json({
        status: "error",
        message: `Unauthorized - ${err.message}`
    })

    return response.status(404).json({
        status: "error",
        message: `Not Found - ${err.message}`
    })

    return response.status(500).json({
        status: "error",
        message: `Internal server error - ${err.message}`
    })

})

