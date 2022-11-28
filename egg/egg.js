'use strict';

function parseExpression(program) {
	console.log('PE b4: ' + program);
	program = skipSpace(program);
	console.log('PE after: ' + program);
	let match, expr;
	if ((match = /^"([^"]*)"/.exec(program))) {
		console.log('value string: ' + match + 'match[1]: ' + match[1]);
		expr = { type: "value", value: match[1] };
	} else if ((match = /^\d+\b/.exec(program))) {
		console.log('value number: ' + match);
		expr = { type: "value", value: Number(match[0]) };
	} else if ((match = /^[^\s(),#"]+/.exec(program))) {
		console.log('word: ' +match);
		expr = { type: "word", value: match[0] };
	} else {
        throw new SyntaxError("Unexpected syntax: " + program);
    }

    console.log('expr: ' + JSON.stringify(expr) + 'program.slice(match[0].length): ' + program.slice(match[0].length))
    return parseApply(expr, program.slice(match[0].length))
}

function skipSpace(string){
    // find index of anypart that is NOT whitespace
    let first = string.search(/\S/);
    // if there isn't any non whitespace characters, return ""
    if (first == -1) return "";
    return string.slice(first);
}

function parseApply(expr, program) {
    console.log('PA: ' + program)
    program = skipSpace(program);
    if (program[0] != "("){
        console.log(`return expr: ${JSON.stringify(expr)} and rest: ${program}`)
        return{expr: expr, rest: program}; 
    }

    program = skipSpace(program.slice(1));
    
    expr = {type: "apply", operator: expr, args: []};
    console.log('while:')
    while (program[0] != ")") {
        let arg = parseExpression(program);
        expr.args.push(arg.expr);
        program = skipSpace(arg.rest);
        console.log(`  expr = ${JSON.stringify(expr)}`)
        if (program[0] == ",") {
            program = skipSpace(program.slice(1));
        } else if (program[0] != ")") {
            throw new SyntaxError("Expected ',' or ')'");
        }
    }

    return parseApply(expr, program.slice(1));
}

function parse(program) {
    let {expr, rest} = parseExpression(program);
    if (skipSpace(rest).length > 0) {
        throw new SyntaxError("Unexpected text after program");
    }
    return expr;
}

console.log(parse("do(\"100\")"));

const specialForms = Object.create(null);

function evaluate(expr, scope){
    console.log(`expr: ${expr}\n scope: ${scope}`);
    if (expr.type == "value"){
        return expr.value;
    } else if (expr.type == "apply"){
        if (expr.name in scope){
            return scope[expr.name]
        } else {
            throw new ReferenceError(
                `Undefined binding: ${expr.name}`);
        }
    } else if (expr.type == "apply"){
        let {operator, args} = expr;
        if (operator.type == "word" &&
            operator.name in specialForms) {
            return specialForms[operator.name](expr.args, scope);
        } 
    }
}