const express = require("express");
const app = express();  // Fixed: Call express()
const http = require('http').createServer(app);

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/index.html');  
});
