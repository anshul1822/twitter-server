import dotenv from 'dotenv';
import {initServer} from './app'

dotenv.config();

async function init() {
    
    // console.log(process.env);

    const app = await initServer();
    app.listen(8005, () => console.log(`Server started at port 8005`));
}

init();