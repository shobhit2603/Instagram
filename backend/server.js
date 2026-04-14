import app from "./src/app.js";
import { config } from "./src/config/config.js";
import { connectDB } from "./src/config/databse.js";
import initSocket from "./src/socket/app.socket.js";
import { createServer } from "http";

const PORT = config.PORT;

const server = createServer(app);

initSocket(server);

try {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("MongoDB connection error:", error);
  process.exit(1);
}
