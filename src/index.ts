import app from './app';
import results from './config/localIPaddr';

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT || 3000;
// server listening
app.listen(port, () => {
    if (results['eth0'] != null) {
        console.log(`local address is: http://localhost:${port}`);
        console.log(`Server running on http://${results['eth0']}:${port}`);
    } else {
        console.log(`local address is: http://localhost:${port}`);
    }
});
