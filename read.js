const fs = require('fs')





const data  = fs.readFileSync("./an.js",  {encoding:'utf8', flag:'r'})
        console.log(data)

const parsedString = data.split('\n').map((line) => line.split('\t'))

console.log(parsedString)    
