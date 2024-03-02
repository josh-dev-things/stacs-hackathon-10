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
        `)
    });

    app.get("/data/atms", function(req, res){
        try {
            let result = filterATMSByQuery(req);
            res.status(200).json(result);
            console.log(`${Time()}  |   GET /data/atms -> [200] JSON object returned (${result.length})`);
        } catch(error) {
            console.error(`${Time()}    |   ERROR (GET /data/atms) : "${error}"`);
            res.status(500).json({});
        }
    });

    app.get("/data/branches", function(req, res){
        try{
            let result = filterBranchesByQuery(req);
            res.status(200).json(result);
            console.log(`${Time()}  |   GET /data/branches -> [200] JSON object returned (${branches.length})`);
        } catch (error) {
            console.error(`${Time()}    |   ERROR (GET /data/branches) : "${error}"`);
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
                console.log(`${Time()}  |   GET /data/atms/${req.params.brand} -> [200] JSON object returned (${result.length})`);
            } else {
                res.status(200).json({});
                console.log(`${Time()}  |   GET /data/atms/${req.params.brand}-> [200] Empty Response`);
            }
        } catch(error) {
            console.error(`${Time()}    |   ERROR (GET /data/atms/${req.params.brand}) : "${error}"`);
            res.status(500).json({});
        }
    });

    app.get("/data/branches/brands/:brand", function(req, res){
        try {
            let brand_branches = branches.data[0].Brand.filter(jso => isBrand(req.params.brand, jso));
            if(brand_branches.length > 0)
            {
                let result = filterBranchesByQuery(req);
                res.status(200).json(result);
                console.log(`${Time()}  |   GET /data/branches/brands/${req.params.brand} -> [200] JSON object returned (${result.length})`);
            } else {
                res.status(200).json({});
                console.log(`${Time()}  |   GET /data/branches/brands/${req.params.brand} -> [200] Empty Response`);
            }
        } catch(error) {
            console.error(`${Time()}    |   ERROR (GET /data/branches/brands/${req.params.brand}) : "${error}"`);
            res.status(500).json({});
        }
    });

    function filterBranchesByQuery(req)
    {
        let id = req.query.id;

        function satisfiesQuery(branch) {

            if(id) {
                if(branch.Identification.toLowerCase() !== id.toLowerCase())
                {
                    return false;
                }
            }

            return true;
        }

        let branch_objects = [];

        branches.data[0].Brand.forEach(b => {
            b.Branch.forEach(branch => {
                if(satisfiesQuery(branch)) {
                    branch_objects.push(branch);
                }
            });
        });

        return branch_objects;
    }

    function filterATMSByQuery(req)
    {
        // Identification
        let id = req.query.id; // /data/atms?id=AWDIP&access=TRUE or similar
        
        // Accessibility
        let acm = req.query.acm; // acm=true/false
        let wa = req.query.wa // wa=true/false

        // Location
        let postcode = req.query.postcode; //postcode

        let lat_min = Number(req.query.latmin);
        let lat_max = Number(req.query.latmax);
        let lon_min = Number(req.query.lonmin);
        let lon_max = Number(req.query.lonmax);

        let town = req.query.town;

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

            if(lon_min !== undefined  && lon_max !== undefined)
            {
                let coords = atm.Location.PostalAddress.GeoLocation.GeographicCoordinates;
                if(Number(coords.Longitude) > lon_max || Number(coords.Longitude) < lon_min)
                {
                    return false;
                }
            }
            
            if(lat_min !== undefined && lat_max !== undefined)
            {
                let coords = atm.Location.PostalAddress.GeoLocation.GeographicCoordinates;
                if(Number(coords.Latitude) > lat_max || Number(coords.Latitude) < lat_min)
                {
                    return false;
                }
            }

            if(town)
            {
                if(town.toLowerCase() !== atm.Location.PostalAddress.TownName.toLowerCase()){
                    return false;
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