const url = "http://trenco.cs.st-andrews.ac.uk:24480/data/atms/brands/santander-uk-plc?";
const min_lat = 49
const max_lat = 61
const min_lon = -8
const max_lon = 2
const incr = .1

window.addEventListener("load", () => {
    populateGrid();
})

async function populateGrid() {
    let count = 0;
    for (let lat = max_lat; lat>min_lat; lat -= incr){ // Up -> Down
        for (let lon = min_lon+incr; lon<max_lon; lon += incr) { // Left -> Right
            let q = `${url}latmin=${lat-incr}&latmax=${lat}&lonmin=${lon}&lonmax=${lon+incr}`
            let response = await fetch (q).then(r => r.json());
            let size = response.length
            if (size > 0) {
                appendToGrid(true, lon, lat);
                count++;
            } else { //if no atm in range
                appendToGrid(false, lon, lat);
                count++;
            }
        }
        console.log(`${count} Grids displayed`);
    }
    
    let response = await fetch(url).then(r => r.json());
    let size
}

function appendToGrid(bool, long, lat) {
    newDiv = document.createElement("div");
    if (bool) {
        newDiv.id = `${long},${lat}`;
        newDiv.classList.add("grid-item");
        /* newDiv.addEventListener("onclick", () => {
            displayData(long,lat)
        }); */
    } else {
        newDiv.classList.add("filler");
    }
    document.getElementById("map").appendChild(newDiv);
}

function displayData(long,lat) {
    let q = `${url}latmin=${lat}&latmax=${lat+incr}&lonmin=${long-incr}&lonmax=${long}`
    fetch(q)
        .then (r => r.json())
        .then (response => {
            response.forEach(atm => {
                let atmInfo = document.createElement('p');
                let text = `Town: ${atm.Location.PostalAddress.TownName}\n`
                text += `Accessibility Features: ${atm.Accessibility}\n`
                text += `24 hours: ${atm.Access24HoursIndicator ? "Yes" : "No"}\n`
                atmInfo.appendChild(document.createTextNode(text))
                nodes.append(atmInfo)
                //parentNode.appendChild(atmInfo);
            })
        })
        .catch(error => {
            console.log(`Error: ${error}`)
        })
    let parentNode = document.getElementById("info");
    while (parentNode.hasChildNodes()){
        parentNode.removeChild(parentNode.firstChild);
    }
    let nodes = []
    for (const element in nodes) {
        parentNode.appendChild(element);
    }
}