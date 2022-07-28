

import {readFileSync} from "fs"

import lexer from "./lexer.js"
import parser from "./parser.js"
// import {isLetter} from "./utils.js"
// import compiler from "./compiler.js"




  let f = readFileSync('../proudofproject.js',  {encoding:'utf8', flag:'r'})
  const l = new lexer("proudofproject.js", f) 
  const lexed = l.lex()
  // console.log([...lexed])
 // console.log(m)
 // let s = m[0]
 // s[s.n].split(":", "")
 // console.log(s)
 // console.log(JSON.parse(s[s.n]))
 
 console.dir(parser(lexed, "proudofproject.js"), {depth: null})
