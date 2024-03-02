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
function getAtms() {
    let wheelchair = document.getElementById("waInput").value;
    let town = document.getElementById("townInput").value;
    let hour = document.getElementById("hourInput").value;

    let url = `http://trenco.cs.st-andrews.ac.uk:24480/data/atms/brands/santander-uk-plc/?`;

    if (wheelchair) url += `wa=${wheelchair}&`;
    if (town) url += `town=${town}&`;
    if (hour) url += `aoi=${hour}&`;

    fetch(url)
        .then(response => {
            console.log(response.status);
            return response.json();
        })
        .then(data => {
            let parentElement = document.getElementById('atmInfo'); 
        
            data.forEach(atm => {
                let atmElement = document.createElement('div');
        
                let servicesElement = document.createElement('p');
                servicesElement.textContent = `ATM Services: ${atm.ATMServices}`;
                atmElement.appendChild(servicesElement);
        
                let amountElement = document.createElement('p');
                amountElement.textContent = `Minimum Possible Amount: ${atm.MinimumPossibleAmount}`;
                atmElement.appendChild(amountElement);
        
                let branchElement = document.createElement('p');
                branchElement.textContent = `Branch ID: ${atm.Branch.Identification}`;
                atmElement.appendChild(branchElement);
        
                let accessibilityElement = document.createElement('p');
                accessibilityElement.textContent = `Accessibility: ${atm.Accessibility}`;
                atmElement.appendChild(accessibilityElement);

                let townElement = document.createElement('p');
                townElement.textContent = `Town: ${atm.Location.PostalAddress.TownName}`;
                atmElement.appendChild(townElement);
        
                parentElement.appendChild(atmElement);
            });
        })
        .catch(error => {
            console.log("Error: " + error);
        });
}