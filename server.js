const fs = require('fs');
const http = require('https');
const express = require('express');

/**
 * Create a new express server
 * @param {Number} port : port server listens on (24480) 
 */
function CreateServer(port = 24480)
{
    const app = express();
    app.use(express.json());

    app.listen(port, () => {
        console.log(`
        =============
        SERVER ONLINE
        =============
        Listening on port: ${port}
        =============
        `)
    });

    app.get("/data/atms", function(req, res){
        try {
            const raw = fs.readFileSync("./ncr-data-set/atms.json", 'utf8');
            const atms = JSON.parse(raw);
    
            res.status(200).json(atms);
            console.log(`${Date.now()}  |   GET /data/atms -> [200] JSON object returned`);
        } catch(error) {
            console.error(`${Date.now()}    |   ERROR (GET /data/atms) : "${error}"`);
            res.status(500).json({});
        }
    });
}

module.exports = CreateServer;