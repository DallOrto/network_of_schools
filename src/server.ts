import express from "express";
import { routes } from "./routes";


const app = express();

app.use(express.json());
app.use(routes);

app.listen(4003, () => console.log("Server is running pn PORT 4003"));