import app from './src/app.js';
import { config } from './src/config/config.js';
import { connectDB } from './src/config/databse.js';

const PORT = config.PORT;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log("Error connecting to database", error);
    });