let string = `searchengine=https://duckduckgo.com/?q=$1
spitefulness=9.7

; comments are preceded by a semicolon...
; each section concerns an individual enemy
[larry]
fullname=Larry Doe
type=kindergarten bully
website=http://www.geocities.com/CapeCanaveral/11451

[davaeorn]
fullname=Davaeorn
type=evil wizard
outputdir=/home/marijn/enemies/davaeorn`

function parseINI(string){
    /* using as regular expression instead of a string, therefore allowing either
    \n or \r\n */
    let lines = string.split(/\r?\n/)
    let object = {};
    
    // note it's important the regExps use ^ and $ to ensure that the whole line adheres and not just part of it
    // invalidRE = \s* zero or more whitespace, in parenthesis ; semi colon followed by . any character. ? optional 
    let invalidRE = /^\s*(;.*)?$/;
    let sectionRE = /^\[(.*)\]$/;
  	let keyValueRE = /^(\w+)=(.*)$/
    
    // lastSection first points to the object itself, than it will point to a newly created object within the object as seen on ref 1
	let lastSection = object;
        
    for (let line of lines){
    	let section;
        let match;
      
      	if(invalidRE.exec(line) || line == ''){
          	//pass
        } else{
            // rmb .exec() returns an array
          	if (section = sectionRE.exec(line)){
                // rmb when you assign an object a key, you must assign it a value too 😵
                // ref 1
            	lastSection = object[section[1]] = {}
            }
          	if (match = keyValueRE.exec(line)){
            	lastSection[match[1]] = match[2];
            }
        }
    }

    return object;
}

console.log(parseINI(string))