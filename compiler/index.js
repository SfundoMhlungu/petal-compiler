

import {readFileSync} from "fs"

import lexer from "./lexer.js"
import parser from "./parser.js"
import compiler from "./compiler.js"




 let f = readFileSync('../an.js',  {encoding:'utf8', flag:'r'})
  const l = new lexer("an.js", f) 
 
 
 
 compiler(parser(l.lex(), "an.js"))
