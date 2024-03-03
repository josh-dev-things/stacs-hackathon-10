const url = "http://trenco.cs.st-andrews.ac.uk:24480/data/atms/brands/santander-uk-plc?";
const min_lat = 49
const max_lat = 61
const min_lon = -8
const max_lon = 2
const incr = .1

window.addEventListener("load", () => {
    populateGrid();
})

document.body.addEventListener('click', function (event) {
    if (event.target.id.search(new RegExp()) > -1) {

    }
})

async function populateGrid() {
    let count = 0;
    
    let response = await fetch(url).then(r => r.json());
    for (let lat = max_lat; lat>min_lat; lat -= incr){ // Up -> Down
        for (let lon = min_lon+incr; lon<max_lon; lon += incr) { // Left -> Right
            atmsInZone = response.filter((atm) => {
                let coords = atm.Location.PostalAddress.GeoLocation.GeographicCoordinates;
                return (Number(coords.Longitude) < lon+incr && Number(coords.Longitude) > lon) &&
                        (Number(coords.Latitude) < lat && Number(coords.Latitude) > lat-incr);
            });

            if(atmsInZone.length > 0) {
                appendToGrid(true, lon, lat);
                count++;
            } else { //if no atm in range
                appendToGrid(false, lat, lon);
                count++;
            }
        }
    }
    console.log(`${count} Grids displayed`);
}

function appendToGrid(bool, lat, lon) {
    newDiv = document.createElement("div");
    if (bool) {
        newDiv.id = `${lat},${lon}`;
        newDiv.classList.add("grid-item");
        newDiv.addEventListener('click', () => {
            emptyInfo();
            displayInfo(lat, lon);
            //document.getElementById("info").innerHTML = elem.innerHTML
        })
    } else {
        newDiv.classList.add("filler");
    }
    document.getElementById("map").appendChild(newDiv);
}

async function displayInfo(lat,lon) {
    let q = `${url}latmin=${lat-incr}&latmax=${lat}&lonmin=${lon}&lonmax=${lon +incr}`
    let elem = document.getElementById("info");
    let response = await fetch(q).then (r => r.json())
    response.forEach(atm => {
        let atmInfo = document.createElement('p');
        let text = `Town: ${atm.Location.PostalAddress.TownName}\n`
        text += `Accessibility Features: ${atm.Accessibility}\n`
        text += `24 hours: ${atm.Access24HoursIndicator ? "Yes" : "No"}\n`
        atmInfo.appendChild(document.createTextNode(text))
        elem.append(atmInfo)
    })
}

function emptyInfo() {
    let elem = document.getElementById("info");
    while(elem.hasChildNodes()){
        elem.firstChild.innerHTML = ""
        elem.removeChild(elem.firstChild);
    }
}