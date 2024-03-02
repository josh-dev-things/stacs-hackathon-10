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
            // if is land
            newDiv = document.createElement("div");
            newDiv.id = `${long},${lat}`;
            newDiv.classList.add("grid-item");
            grid.appendChild(newDiv);
            //if not is land
            
        }
    }
}