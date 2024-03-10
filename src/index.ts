import {initServer} from './app'

async function init() {
    
    const app = await initServer();
    app.listen(8005, () => console.log(`Server started at port 8005`));
}

init();