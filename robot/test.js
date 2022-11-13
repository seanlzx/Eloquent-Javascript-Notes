routes =
[
    {"route":["Marketplace","Farm","Grete's House","Ernie's House"],"isPickedUp":false},
    {"route":["Marketplace","Town Hall"],"isPickedUp":false},
    {"route":["Marketplace","Farm"],"isPickedUp":false},
    {"route":["Marketplace","Farm","Grete's House","Ernie's House"],"isPickedUp":false},
    {"route":["Marketplace","Town Hall","Daria's House"],"isPickedUp":false}]

function findShortest(a, c) {
    console.log("a  "+JSON.stringify(a))
    console.log("c  "+JSON.stringify(c))
    return a.route.length < c.route.length ? a : c;
}

let filteredRoutes = routes.filter(route => !route.isPickedUp)

console.log(filteredRoutes)

let route = filteredRoutes.reduce(findShortest).route

console.log(route)