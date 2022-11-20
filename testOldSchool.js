let planets = function(){
	return{
    	earth(){ return 'our home world'},
      	mercury(){return 'closest to the sun'},
  		venus(){return 'where women descend from'},
  		mars(){return 'where men hail from'},
  		saturn(){return 'famous for rings'},
  		jupiter(){return 'big'},
  		uranus(){return 'shutup'},
  		neptune(){return 'blue'}
    }
}();
/* notice the use of the parenthesis above, so that when you call planets, you 
do not have to use the parenthesis at the end.
oh and for this to work it has to be a function expression
*/

console.log(planets.earth());