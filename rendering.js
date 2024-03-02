const url = "http://trenco.cs.st-andrews.ac.uk:24480/data/atms/brands/santander-uk-plc?";
const min_lat = 49
const max_lat = 59
const min_long = -7
const max_long = 2

window.addEventListener("load", () => {
    populateGrid();
})

function populateGrid() {
    for (let long=min_long; long<max_long; long += .1) {
        for (let lat = max_lat; lat>min_lat; lat -= .1){
            let q = `${url}latmin=${lat}&latmax=${lat+.1}&lonmin=${long-.1}&lonmax=${long}`
            fetch (q)
                .then (r => r.json())
                .then(response => {
                    let size = response.length
                    if (size > 0) {
                        appendToGrid(true, long, lat);
                    } else { //if no atm in range
                        appendToGrid(false, long, lat);
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
    } else {
        newDiv.classList.add("filler");
    }
    document.getElementById("map").appendChild(newDiv);
}

function getAtms() {
    let wheelchair = document.getElementById("waInput").value;
    let town = document.getElementById("townInput").value;
    let hour = document.getElementById("hourInput").value;

    let myURL = url;
    
    if (wheelchair) myURL += `wa=${wheelchair}&`;
    if (pc) myURL += `postcode=${pc}&`;
    if (hour) myURL += `aoi=${hour}&`;

    fetch(myURL)
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