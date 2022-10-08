const app = require("./app");
const { API_PORT } = process.env;
const results = require("./config/localIPaddr");
const port = process.env.PORT || API_PORT;
// server listening
app.listen(port, () => {
    if (results["eth0"]) {
        console.log(`Server running on http://${results["eth0"]}:${port}`);
    } else {
        console.log(`Server running on port: ${port}`);
    }
});
