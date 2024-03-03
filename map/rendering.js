const url = "http://trenco.cs.st-andrews.ac.uk:24480/data/atms/brands/santander-uk-plc?";
// size of uk
const min_lat = 49;
const max_lat = 61;
const min_lon = -8;
const max_lon = 2;
// increment of lat & lon for each grid object, if changed, must change css for grid-container
const incr = .1;

window.addEventListener("load", () => {
    populateGrid();

    document.getElementById("map").addEventListener('mouseover', function (event) {
        let params = event.target.id.split(","); // split into lat and lon 
        if (!isNaN(params[0] - parseFloat(params[0])) && !isNaN(params[1] - parseFloat(params[1]))) { // if valid floats
            emptyInfo();
            displayInfo(Number(params[0]), Number(params[1]));
        }
    })    
})

/**
 * Function that populates the grid in map.html with grid items where there are atms
 */
async function populateGrid() {
    let response = await fetch(url).then(r => r.json()); // get json of atms
    for (let lat = max_lat; lat>min_lat; lat -= incr){ // north to south
        for (let lon = min_lon+incr; lon<max_lon; lon += incr) { // west to east
            // filter coords that are in the range
            atmsInZone = response.filter((atm) => {
                let coords = atm.Location.PostalAddress.GeoLocation.GeographicCoordinates;
                return (Number(coords.Longitude) < lon+incr && Number(coords.Longitude) > lon) &&
                        (Number(coords.Latitude) < lat && Number(coords.Latitude) > lat-incr);
            });
            // if there are atms in range, append map div
            if(atmsInZone.length > 0) {
                appendToGrid(true, lat, lon);
            } else { // if no atm in range, append filler div
                appendToGrid(false, lat, lon);
            }
        }
    }
}

/**
 * Function to append a square to the grid in map.html
 * 
 * @param {Boolean} bool true if there are atms in that area, false otherwise
 * @param {Number} lat max latitude
 * @param {Number} lon min longitude
 */
function appendToGrid(bool, lat, lon) {
    newDiv = document.createElement("div");
    if (bool) {
        newDiv.id = `${lat},${lon}`;
        newDiv.classList.add("grid-item");
    } else {
        newDiv.classList.add("filler");
    }
    document.getElementById("map").appendChild(newDiv);
}

/**
 * Function to display the info of a given area in map.html
 * 
 * @param {Number} lat 
 * @param {Number} lon 
 */
async function displayInfo(lat,lon) {
    let query = `${url}latmin=${lat-incr}&latmax=${lat}&lonmin=${lon}&lonmax=${lon +incr}`;
    let elem = document.getElementById("info");
    let response = await fetch(query).then (r => r.json());
    // For each atm, compile data into text and append
    response.forEach(atm => {
        let atmInfo = document.createElement('p');
        let text = `${atm.Location.PostalAddress.TownName}, ${atm.Location.PostalAddress.PostCode}<br>`;
        text += `Accessibility: ${atm.Accessibility}<br>`;
        text += `Languages: ${atm.SupportedLanguages}<br>`;
        atmInfo.innerHTML = text;
        elem.append(atmInfo);
    })
}

/**
 * Function to empty the info div in map.html
 */
function emptyInfo() {
    let elem = document.getElementById("info");
    while(elem.hasChildNodes()){
        elem.firstChild.innerHTML = "";
        elem.removeChild(elem.firstChild);
    }
}