const url = "http://trenco.cs.st-andrews.ac.uk:24480/data/atms/brands/santander-uk-plc?";
const min_lat = 49
const max_lat = 61
const min_lon = -8
const max_lon = 2
const incr = .1

window.addEventListener("load", () => {
    populateGrid();
})

function populateGrid() {
    for (let lat = max_lat; lat>=min_lat; lat -= incr){
        for (let lon = min_lon; lon<=max_lon; lon += incr) {
            let q = `${url}latmin=${lat-incr}&latmax=${lat}&lonmin=${lon}&lonmax=${lon+incr}`
            fetch (q)
                .then (r => r.json())
                .then(response => {
                    let size = response.length
                    if (size > 0) {
                        appendToGrid(true, lon, lat);
                    } else { //if no atm in range
                        appendToGrid(false, lon, lat);
                    }
                })
                .catch(error => {
                    console.log(`Error: ${error}`)
                })
        }
    }
}

function appendToGrid(bool, long, lat) {
    newDiv = document.createElement("div");
    if (bool) {
        newDiv.id = `${long},${lat}`;
        newDiv.classList.add("grid-item");
        newDiv.addEventListener('mouseover', () => {
            emptyInfo();
            displayInfo();
            //document.getElementById("info").innerHTML = elem.innerHTML
        })
    } else {
        newDiv.classList.add("filler");
    }
    document.getElementById("map").appendChild(newDiv);
}

function displayInfo(long,lat) {
    let q = `${url}latmin=${lat-incr}&latmax=${lat}&lonmin=${long}&lonmax=${long +incr}`
    let elem = document.getElementById("info");
    fetch(q)
        .then (r => r.json())
        .then (response => {
            response.forEach(atm => {
                let atmInfo = document.createElement('p');
                let text = `Town: ${atm.Location.PostalAddress.TownName}\n`
                text += `Accessibility Features: ${atm.Accessibility}\n`
                text += `24 hours: ${atm.Access24HoursIndicator ? "Yes" : "No"}\n`
                atmInfo.appendChild(document.createTextNode(text))
                elem.append(atmInfo)
                //parentNode.appendChild(atmInfo);
            })
        })
        .catch(error => {
            console.log(`Error: ${error}`)
        })
}

function emptyInfo() {
    let elem = document.getElementById("info");
    while(elem.hasChildNodes()){
        elem.firstChild.innerHTML = ""
        elem.removeChild(elem.firstChild);
    }
}