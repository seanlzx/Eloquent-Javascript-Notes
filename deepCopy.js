array1 = [
	[1, 2, 3],
	[4, 5, 6, [7, 8, 9]],
];

array2 = array1;

array3 = multidimensionalCopy(array1);

function multidimensionalCopy(array) {
	let newArray = []; // ffs the reason it wasn't working the wholetime was cos you didn't use the let prefix😤, causing the newArray binding to be global and overwritten whenever multidimensional copy is called
	console.log(`newArray: ${newArray}`);
	for (e of array) {
		console.log(`   e:${e}`)
        if (typeof e != "object") {
            console.log(`       e != object: ${e}`)
			newArray.push(e);
		} else {
            console.log(`       e == object: ${e}`)
			newArray.push(multidimensionalCopy(e));
		}
	}

    console.log(`newArray2: ${newArray}`)
	return newArray;
}

console.log(JSON.stringify(array1));
console.log(JSON.stringify(array2));
console.log(JSON.stringify(array3));
