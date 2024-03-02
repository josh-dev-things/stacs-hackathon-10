/* import data from "./ncr-data-set/atms.json";
const atms_json_path = "./ncr-data-set/atms.json";
const atms = JSON.parse(data)
console.log(atms); */
const min_long = 49
const max_long = 59
const min_lat = -7
const max_lat = 2

window.addEventListener("load", () => {
    populateGrid();
})

function populateGrid() {
    const grid = document.getElementById("map");
    for (let long=max_long; long>min_long; long -= .1) {
        for (let lat = min_lat; lat<max_lat; lat += .1){
            newDiv = document.createElement("div");
            newDiv.id = `${long},${lat}`;
            newDiv.classList.add("grid-item");
            
            // if there is atm in rnage
            /* if (atmListed(long,lat)) {
                newDiv.id = `${long},${lat}`;
                newDiv.classList.add("grid-item");
            } else { //if no atm in range
                newDiv.classList.add("filler");
            } */
            grid.appendChild(newDiv);
        }
    }
}

/* function atmListed(long,lat) {
    list = atms.data.Brand.ATM;
    for (const atm in list) {
        let coords = atm.Location.PostalAddress.GeoLocation.GeographicCoordinates; 
        if (atm.Longitude === long && atm.Latitude === lat) {
            return true
        }
    }
    return false;
} */