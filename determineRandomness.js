// given an array of options calculate the percent how much each of those options are chosen
let array = [1, 2, 3, 4, 5]

percents = {}
for (let e of array){
    percents[e] = 0
}

for(let i = 0; i < 1000000; i++){
    percents[Math.floor(Math.random()*5+1)]++
}

console.log(percents)