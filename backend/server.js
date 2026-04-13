import { config } from './src/config/config.js';
import { connectDB } from './src/config/databse.js';
import server from './src/socket/app.socket.js';

const PORT = config.PORT;

try {
    await connectDB();
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
} catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
}