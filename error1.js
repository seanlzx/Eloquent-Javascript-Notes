function numberToString(n, base = 10) {
    let result = "", sign = "", current = n;
    if (n < 0)
        sign = '-'
    do {
        result = n % base + result   
        n = Math.floor(n/base)
    } while (n > 0)

    return result
}

console.log(numberToString(142, 2))