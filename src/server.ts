import { app } from "./app";

const PORT = process.env.PORT || 4003;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})
