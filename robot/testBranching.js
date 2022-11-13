// attempt printing a octal counter
'use strict';
// let string = "";

// for(let i = 0; i < 8; i++){
//     string += i;
//     for(let j = 0; j < 8; j++){
//         string += j
//         console.log(string);   
//         string = string.slice(0,1);
//     }
//     string = "";
// }

// attempt recursive octal counter, fail


//attempt octal counter using arrays

function octalCounter(length){
    let array = [0, 0, 0]
    function arrayFiller(index){

        if(index < 0) return;
        while(array[index] != 7){
            array[index]++
            if(index<length-1) arrayFiller(index+1);
            let filled = true
            for(let i = 0, aLength = array.length; i < aLength; i++){
                console.log(array)
                if(array[i] != 7){
                    console.log(array)
                    filled = false;
                    break;
                }
            }
            if(filled) return;
            console.log(array)
        }
        array[index] = 0;       //restart to zero at the index, might change later
        arrayFiller(index-1)
    }
    arrayFiller(length - 1);
}

octalCounter(3)

// attempt branching both recursively and without recursion,

