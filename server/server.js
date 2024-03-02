const fs = require('fs');
const http = require('https');
const express = require('express');
const cors = require('cors');

// Time Stamps
const Time = require('./timestamp.js');

/**
 * Create a new express server
 * @param {Number} port : port server listens on (24480) 
 */
function CreateServer(port = 24480)
{
    const app = express();

    // Middleware
    app.use(express.json());
    app.use(cors());
    app.use(express.urlencoded({extended:true}));

    const raw_atms = fs.readFileSync("./ncr-data-set/atms.json");
    const atms = JSON.parse(raw_atms);

    const raw_branches = fs.readFileSync("./ncr-data-set/branches.json");
    const branches = JSON.parse(raw_branches);

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
            let result = filterATMSByQuery(req);
            res.status(200).json(result);
            console.log(`${Time()}  |   GET /data/atms -> [200] JSON object returned`);
        } catch(error) {
            console.error(`${Time()}    |   ERROR (GET /data/atms) : "${error}"`);
            res.status(500).json({});
        }
    });

    app.get("/data/atms/brands/:brand", function(req,res){
        try {
            let brand_atms = atms.data[0].Brand.filter(jso => isBrand(req.params.brand, jso));
            if(brand_atms.length > 0)
            {
                let result = filterATMSByQuery(req);
                res.status(200).json(result);
                console.log(`${Time()}  |   GET /data/atms/:brand -> [200] JSON object returned`);
            } else {
                res.status(200).json({});
                console.log(`${Time()}  |   GET /data/atms/:brand -> [200] Empty Response`);
            }
        } catch(error) {
            console.error(`${Time()}    |   ERROR (GET /data/atms/:brand) : "${error}"`);
            res.status(500).json({});
        }
    });

    function filterATMSByQuery(req)
    {
        // Identification
        let id = req.query.id; // /data/atms?id=AWDIP&access=TRUE or similar
        
        // Accessibility
        let acm = req.query.acm; // acm=true/false
        let wa = req.query.wa // wa=true/false

        // Location
        let postcode = req.query.postcode; //postcode

        // Open 24 hours?
        let aoi = req.query.aoi; // always open

        function satisfiesQuery(atm)
        {
            if(id) {
                if(atm.Identification.toLowerCase() !== id.toLowerCase())
                {
                    return false;
                }
            }

            if(postcode)
            {
                if(atm.Location.PostalAddress.PostCode.replace(/ /g, "") !== postcode.toUpperCase().replace(/-/g, ""))
                {
                    return false;
                }
            }

            if(aoi)
            {
                let aoi_bool = aoi.toLowerCase() === "true";

                if(atm.Access24HoursIndicator !== aoi_bool)
                {
                    return false;
                }
            }

            if(acm) {
                switch (acm) {
                    case "true":
                        if(!atm.Accessibility.includes("AudioCashMachine"))
                        {
                            return false;
                        }
                        break;
    
                    case "false":
                        if(atm.Accessibility.includes("AudioCashMachine"))
                        {
                            return true;
                        }
                        break;

                    default:
                        break;
                }
            }
            
            if(wa) {
                switch (wa) {
                    case "true":
                        if(!atm.Accessibility.includes("WheelchairAccess")) {
                            return false;
                        }
                        break;
    
                    case "false":
                        if(atm.Accessibility.includes("WheelchairAccess"))
                        {
                            return false;
                        }
                        break;
                
                    default:
                        break;
                }
            }

            return true;
        }

        let atm_objects = [];

        atms.data[0].Brand.forEach(b => {
            b.ATM.forEach(atm => {
                if(satisfiesQuery(atm))
                {
                    atm_objects.push(atm);
                }
            });
        });

        return atm_objects;
    }
}

function isBrand(brand, jso)
{
    return jso.BrandName.toLowerCase().replace(/ /g, "-").trim() === brand.trim();
}

function copyJSO(jso)
{
    return JSON.parse(JSON.stringify(jso));
}

module.exports = CreateServer;