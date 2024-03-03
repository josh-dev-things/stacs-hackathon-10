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
            parentElement.innerHTML = "";
        
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

                let pcElement = document.createElement('p');
                pcElement.textContent = `PostCode: ${atm.Location.PostalAddress.PostCode}`;
                atmElement.appendChild(pcElement);
        
                parentElement.appendChild(atmElement);
            });
        })
        .catch(error => {
            console.log("Error: " + error);
        });
}

function getBranch() {
    
}