import app from "./app.ts";
import { config } from "./config/config.ts";
import { httpResponse } from "./utils/httpResponse.ts";

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});



app.get("/health", (req, res) => {
    return httpResponse(res, req, 200, "Server is up and running");
});
