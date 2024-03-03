function getAtms() {
    let wheelchair = document.getElementById("waInput").value;
    let town = document.getElementById("townInput").value;
    let postcode = document.getElementById("pcInput").value;
    let hour = document.getElementById("hourInput").value;

    let url = `http://trenco.cs.st-andrews.ac.uk:24480/data/atms/brands/santander-uk-plc/?`;

    if (wheelchair) url += `wa=${wheelchair}&`;
    if (town) url += `town=${town}&`;
    if (postcode) url += `postcode=${postcode}&`;
    if (hour) url += `aoi=${hour}&`;

    fetch(url)
        .then(response => {
            console.log(response.status);
            return response.json();
        })
        .then(data => {
            console.log(data)
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
    let wheelchair = document.getElementById("waBranchInput").value;
    let town = document.getElementById("townBranchInput").value;

    let url = `http://trenco.cs.st-andrews.ac.uk:24480/data/branches/brands/santander-uk-plc/?`;

    if (wheelchair) url += `wa=${wheelchair}&`;
    if (town) url += `town=${town}&`;

    console.log(url);

    fetch(url)
        .then(response => {
            console.log(response.status);
            return response.json();
        })
        .then(data => {
            let parentElement = document.getElementById('BranchInfo'); 
            parentElement.innerHTML = "";
        
            data.forEach(branch => {
                let branchElement = document.createElement('div');
        
                let AccessibilityElement = document.createElement('p');
                AccessibilityElement.textContent = `Branch Accessibility: ${branch.Accessibility}`;
                branchElement.appendChild(AccessibilityElement);
                
                // Check if the branch has standard availability
                if (branch.Availability && branch.Availability.StandardAvailability) {
                    let openingHoursElement = document.createElement('p');
                    let openingHours = branch.Availability.StandardAvailability.Day.map(day => {
                        return `${day.Name}: ${day.OpeningHours[0].OpeningTime} - ${day.OpeningHours[0].ClosingTime}`;
                    }).join('\n');
                    openingHoursElement.textContent = `Opening Hours:\n${openingHours}`;
                    branchElement.appendChild(openingHoursElement);
                }

        
                parentElement.appendChild(branchElement);
            });
        })
        .catch(error => {
            console.log("Error: " + error);
        });
}

window.onload = function() {
    document.getElementById('jsonExample').textContent = JSON.stringify([{"Identification":"A021461A","SupportedLanguages":["en","es"],"ATMServices":["CashWithdrawal","CashDeposits","PINChange","ChequeDeposits","Balance"],"Accessibility":["AudioCashMachine","WheelchairAccess"],"Access24HoursIndicator":false,"SupportedCurrencies":["GBP"],"MinimumPossibleAmount":"10","Note":["DATM"],"OtherAccessibility":[{"Code":"DTSA","Name":"Digital Touch Screen","Description":"All our Digital ATM's are fitted with a touch screen for ease of access."}],"Branch":{"Identification":"0214"},"Location":{"LocationCategory":["BranchInternal"],"OtherLocationCategory":[{"Code":"BRIN","Name":"BRANCH INTERNAL","Description":"Internal ATM at a Branch"}],"Site":{"Identification":"1214","Name":"ABERYSTWYTH 1 GD"},"PostalAddress":{"StreetName":"1 GREAT DARKGATE ST","TownName":"Aberystwyth","CountrySubDivision":["Dyfed"],"Country":"GB","PostCode":"SY23 1DE","GeoLocation":{"GeographicCoordinates":{"Latitude":"52.415085","Longitude":"-4.083687"}}}}},{"Identification":"A021462A","SupportedLanguages":["en","es"],"ATMServices":["CashWithdrawal","CashDeposits","PINChange","ChequeDeposits","Balance"],"Accessibility":["AudioCashMachine"],"Access24HoursIndicator":true,"SupportedCurrencies":["GBP"],"MinimumPossibleAmount":"10","Note":["DATM"],"OtherAccessibility":[{"Code":"DTSA","Name":"Digital Touch Screen","Description":"All our Digital ATM's are fitted with a touch screen for ease of access."}],"Branch":{"Identification":"0214"},"Location":{"LocationCategory":["BranchExternal"],"OtherLocationCategory":[{"Code":"BREX","Name":"BRANCH EXTERNAL","Description":"External ATM at a Branch"}],"Site":{"Identification":"1214","Name":"ABERYSTWYTH 1 GD"},"PostalAddress":{"StreetName":"1 GREAT DARKGATE ST","TownName":"Aberystwyth","CountrySubDivision":["Dyfed"],"Country":"GB","PostCode":"SY23 1DE","GeoLocation":{"GeographicCoordinates":{"Latitude":"52.415085","Longitude":"-4.083687"}}}}}], null, 2);
}