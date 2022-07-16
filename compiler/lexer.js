// export function* lexer(filename, input){
//    let cursor = 0;
//    let char =   str[cursor]
//    let line = 1
//    let column = 1
//  }



import {readFileSync} from "fs"

import {iswhitespace, isLetter, iskeyword} from "./utils.js"
 
 let f = String(readFileSync('../an.js'))
 console.log(f)
// for(let i of f){
//   console.log(i)

// }
 
 export default class lexer{
       constructor(filename, input){
           this.filename = filename;
           this.input = input
           this.cursor = 0;
           this.char = this.input[this.cursor]
           this.line = 1;
           this.column = 1;       
           this.state = {
               component: {
                  gotStart: false,
                  gotEnd: false,
               
               }
             
           }       
       
       }
   
        
   
       *lex(){
         
         
         for(;;){
            let token = this.whitespace() || this.component() || this.skipletter() || this.eol()
            // if token is whitespace continue
              console.log(token, "token")
                  if(token){
                                 if(token === true){
                                            continue
                                 }
                                 
                                 yield token
                                 
                                 continue
           }
      
            
         
          const maybeEOF = this.eof()
          console.log(maybeEOF, "is it the end")
         // else return that token 
           if(maybeEOF){
             yield maybeEOF
             break;
           }
         
         }      
      
      }
 
 
 
 }
 
 
 
 lexer.prototype.next = function(){
      this.cursor++;
      this.char = this.input[this.cursor]
      // console.log(this.char, this.cursor)
      this.column++
 
 
 }
 
 lexer.prototype.newLine = function(){
     this.line++;
     this.column = 1
 
 
 }
 
 
lexer.prototype.skipletter = function(){
     const r = new RegExp("^\\s+")
     
   if(this.char === undefined){
             return null 
   }
  
    if(isLetter(this.char) || this.char === "$" || this.char === `"` || this.char === "{" || this.char === "}" || this.char === "(" || this.char === ")"){
       while(isLetter(this.char) || this.char === "$" || this.char === `"` || this.char === "{" || this.char === "}" || this.char === "(" || this.char === ")"){
          
           this.next()
           console.log("skipping")
       
       }
    }


   return true
} 
 
 lexer.prototype.component = function(){
    
       let buffer = ""
       if(this.char !== ".") return null;
       
       this.next()
          console.log(isLetter(this.char))
       while(isLetter(this.char)){
          console.log("is letter", this.char)
          buffer += this.char;
          this.next()
       
       }
       
       if(buffer.length >= 1 && iskeyword(buffer)){
 
              
              
           if(buffer === "start"){
              if(this.state.component.gotStart){
              
                 throw new Error("unclosed component somewhere")
              }else{
                 this.state.component.gotStart = true;
                
                 
              }
           
           }else if(buffer === "end"){
               if(!this.state.component.gotStart){
                   throw new Error("don't know where this comp starts")
            
               }else{
                   this.state.component.gotStart = false;
                   
               
               }
           
           
           }  else{}         
           
           return{
              type: buffer,
            
           
           }
       
       }
 
 
 
 
 }
 
 
 
 lexer.prototype.whitespace = function(){
     //console.log("t", this.char)
    if(iswhitespace(this.char)){
         console.log("is whitespace")
      this.next()
    }
    
    while(iswhitespace(this.char)){
        this.next()
    }
 
 
     return null
 }
 
 
 
lexer.prototype.eol = function(){
   if(this.char === "\n"){
      this.newLine()
      this.next()
   
   }else{
        return null
    }
   
   while(this.char === "\n"){
   console.log(this.char, "eol")
     this.newLine()
     this.next()
   
   
   }
   
   console.log("end of line returns")
   
   return true


}


 lexer.prototype.eof = function(){
      if(this.char === undefined){
          console.log("end of file")
         return {
            type: "EOF"
         
         }
      }
      
      
      return null
 
 
 }
  
 let  l = new lexer("dd.js", f)
 
 
// console.log(l.lex().next().value)
// console.log(l.lex().next().value)
// console.log(l.lex().next().value)
// console.log(l.lex().next().value)
// console.log(l.lex().next().value)


console.log([...l.lex()])
