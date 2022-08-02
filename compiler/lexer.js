// export function* lexer(filename, input){
//    let cursor = 0;
//    let char =   str[cursor]
//    let line = 1
//    let column = 1
//  }




import {iswhitespace, isLetter, iskeyword} from "./utils.js"
 

//  console.log(f)
// for(let i of f){
//   console.log(i)

// }
 
 export default class lexer{
       constructor(filename, input){
           this.nulls = 0;
           this.trues = 0;
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
            let token = this.whitespace() || this.localstate() || this.component() 
            || this.element() || this.textNode() || this.loop() || this.eol()
            // if token is whitespace continue
              console.log(token, "token", this.char, this.line, this.column)
          if(token){
         
                     if(token === true){
                          
               
                              // if(this.char !== undefined || this.char !== null || !iswhitespace(this.char)){
                              //    console.log(this.char, "where is it")
                              //    throw new SyntaxError(`cannot lex beyond line ${this.line}, maybe an unexpected character before or in that line
                              //                         the lexer is stuck lexing this character -> ${this.char}
                              //                         it may be a start to an unrecognized keyword, char etc
                              //                         `)
                              // }
                            continue
                            
                     }
                                // this.trues = 0
                                 yield token
                                 
                                 continue
           }
      
           if(token === null){
                 const maybeEOF_ = this.eof()
         //  console.log(maybeEOF, "is it the end")
         // else return that token 
           if(maybeEOF_){
             yield maybeEOF_
             break;
           }
               this.nulls += 1
               
               if(this.nulls > 100){
                  throw new SyntaxError(`cannot lex beyond line ${this.line}, maybe an unexpected character before or in that line
                                         the lexer is stuck lexing this character -> ${this.char}
                                         it may be a start to an unrecognized keyword etc
                                       `)
               }
               this.nulls = 0
               continue
           
           }
         
          const maybeEOF = this.eof()
         //  console.log(maybeEOF, "is it the end")
         // else return that token 
           if(maybeEOF){
             yield maybeEOF
             break;
           }
           
           
           throw new SyntaxError(`unkown token ${token} at ${this.line}:${this.column}`)
         
         }   
            
      
      }
 
 
 
 }
 
 
 
 lexer.prototype.next = function(){
      this.cursor++;
      this.char = this.input[this.cursor]
      // console.log(this.char, this.cursor)
      this.column++
 
 
 }
 
lexer.prototype.peek =function(){
      return this.input[this.cursor + 1]
    
}

 lexer.prototype.newLine = function(){
     this.line++;
     this.column = 1
 
  // console.log("new Line", this.line, this.column)
 
 }
 
 
lexer.prototype.skipletter = function(){
     const r = new RegExp("^\\s+")
     
   if(this.char === undefined){
             return null 
   }
  
    if(isLetter(this.char) || this.char === `"`){
       while(isLetter(this.char) || this.char === `"`){
          
           this.next()
           console.log("skipping", this.char)
       
       }
    }


   return true
} 




lexer.prototype.element  = function(){
      if(this.char !== "$") return null;
      let col = gatherWhitespaces(this.input, this.cursor)
      this.next()
      let element = ""
    
    let attrName_ = null;
    let attrValue = null;
      let attrName = true
      let attrs = {}
      let checkedFirstLetter = false
      
      // passing element only 
      while(!iswhitespace(this.char) && this.char !== "\n"){
         //   console.log(this.char)
           if(!checkedFirstLetter){
             checkedFirstLetter = true
             if(!isLetter(this.char)) throw new Error("expected an element shortly after $ sign at")
           }
         
          element += this.char 
          this.next()
          
         // console.log(element)
      }// if encounters a whitespace or new line it will break
      
      // if(this.char === "\n") return null
         // console.log(this.char, "after getting ele")
      while(this.char !== "\n" ){
      
         while(iswhitespace(this.char)) {
            //  console.log(this.char, "iswhitespace")
           this.next()
          if(this.char === "\n") break;
         }
         
         
         if(isLetter(this.char) || this.char === `"` || this.char === "{"){
             // either attr or value
            //  console.log(this.char, "is letter")
             let buffer = ""
             // passing attr 
             while(isLetter(this.char)){
               //  console.log('DOING LETTER PASSING')
                buffer += this.char
               //  console.log(buffer, "buffer")
                this.next() 
             }
             // if(this.char !== `"`) return null
              // SUPPOSADLEY GOT ATTRSVALUE  
            if(this.char === `"` || this.char === "{" )  {
               // console.log("parsing str")
               if(this.char === `"`){
                  this.next()
                    while(this.char !== `"`){
                     buffer += this.char
                     //   console.log(buffer, "DOING STR PASSING")
                     this.next()
                     
                     }
               }else if(this.char === "{"){
                       this.next()
                        buffer = {
                            value: ""
                        }
                        while(this.char !== "}"){
                           buffer.value += this.char
                           //   console.log(buffer, "DOING STR PASSING")
                           this.next()
                           
                           }   
               
               }
              
                
              
               this.next()
               
               
            }
            if(attrName){
                attrName_ = buffer 
                attrName = false
                attrValue = null
                
              
            }else{
                attrValue = buffer
                attrName = true 
                
            
            }
            
            if(attrName_ && attrValue){
                attrs[attrName_] = attrValue
                attrName_ = null
                
            
            }
         }
      
      }
      // console.log('FOUND NEW LINE')
      // this.newLine()
      // this means we have attribs
 const el =  {
     type: "element", 
     node: element,
     attrs,
     loc: {line:this.line, column:col}
   
   }
   // console.log(el)
   return el

}


function gatherWhitespaces(input, currentPos){
   let count = 0
   let pos = currentPos
   let char = input[pos]
   
   while(char !== "\n"){
      if(char === " "){
         count++
       
      }
      pos--
      char = input[pos]
      
   
   }


   return count



} 


lexer.prototype.loop = function(){
  if(this.char === undefined) return null;
   if(!isLetter(this.char)) return null;
   if(this.char !== "f") return null;
    let col = gatherWhitespaces(this.input, this.cursor)
     let line = this.line
   
   let buffer = ""
   let target = ""
   let property = ""   
 
 
     while(isLetter(this.char)){
       buffer += this.char 
       this.next()
     
     }
     if(buffer === "fn" || buffer === "function"){
        let f =  this.fn()
        // console.log(f, "f")
        return f
     
     }
     
     if(buffer === "for"){
       // this.next()
       // console.log()
       if(!iswhitespace(this.char)) throw new Error("expected whitespace after for")
       
          while(iswhitespace(this.char)){
            if(this.char === "\t" || this.char === "\n"){
             throw new Error("an object property is expected after for")
           }
            this.next()
           }
           
           
           
           while(!iswhitespace(this.char)){
             property += this.char
             this.next()
           
           }
           
          while(iswhitespace(this.char)){
            if(this.char === "\t" || this.char === "\n"){
             throw new Error("in is expected after an object property")
           }
            this.next()
           }
           
           if(!isLetter(this.char)) throw new Error("expected the letter i for in before object path")
                 buffer = ""
               while(isLetter(this.char)){
                  buffer += this.char 
                  this.next()
               
               }
               
            if(buffer === "in"){
                 // this.next()
                 if(!iswhitespace(this.char)) throw new Error("expected whitespace after in")
                 while(iswhitespace(this.char)){
                     if(this.char === "\t" || this.char === "\n"){
                     throw new Error("an object path chain is expected after in")
                  }
                     this.next()
                  }
                  
                  
                        while(!iswhitespace(this.char)){
                              if(this.char === "\t" || this.char === "\n"){
                                 break
                              }
                              target += this.char
                              this.next()
                           
                           }
            
            }else{
                throw new Error("expected in")
            
            }
          
           
     
     
     }else{
         // new error no keyword starts with f
     
     }
 
 this.newLine()
 return {
    type: "loop",
    property, 
    target, 
    attrs: {},
     loc: {line, column: col}
 
 }

}

lexer.prototype.localstate = function(){  
     if(this.char === undefined) return null;
   if(!isLetter(this.char)) return null;
   if(this.char !== "l") return null;
   
     let buffer = ""
     let name = ""
     let value = ""
     let column = this.column 
     let line = this.line
     
     while(isLetter(this.char)){
        buffer += this.char;
        this.next()
     
     }
     // console.log(buffer)
     
     if(buffer === "local"){
           this.next()
           while(iswhitespace(this.char)){
            if(this.char === "\t" || this.char === "\n"){
             throw new Error("a state object should be in the same line a local keyword found none")
           }
            this.next()
           }
       
           
          if(this.char === "\t" || this.char === "\n"){
             throw new Error("a state object should be in the same line a local keyword found none")
          }
           
           if(isLetter(this.char)){
              while(isLetter(this.char)){
                name += this.char
                this.next()
              
              }
                 
              // passing the actual object
              
               while(iswhitespace(this.char)){
                     if(this.char === "\t" || this.char === "\n"){
                           throw new Error("a state object should be in the same line a local keyword found none")
                        }
                     this.next()
               }  
               
             
               
               if(this.char === "{"){
                
                       while(this.char !== "}"){
                          // console.log(buffer, name, this.char, value)
                          if(this.char === "$" || this.char === undefined){
                            throw new Error("no closing brace for state")
                          
                          }
                          value += this.char 
                          this.next()
                       
                       
                       }
                         value += this.char;
                         this.next()
                         
                         while(this.char === "}"){
                           this.next()
                         }
                         // console.log(buffer, name, this.char, value)
                   
               }else{
                  throw new Error("expected a curly brace here")
               
               } 
           
              
           
           }else{
              throw new Error("state name must be letters only,")
           
           }
     }else{
        throw new Error(`unkwown keyword ${buffer}`)
     
      }
 
// let prop = true      
// let property = "" 
// let val = "" 
 
// let v = value.replace(/[\r\n{}\s]/gm, "")   

// for(va_ in v){
//    if(va_ === ":"){
//        prop = false 
//    }
//    else if(prop){
//       property += va_ 
   
//    }else{
//       val += va_
//    }

// }


//console.log(v.split(":"))  

// let i = 0 
// let ob = {}
// let temp = ""
// // console.log(value.length)
// for(let val_ of value) {
//     // temp = value[i]
//     // console.log(val_ === "\n")
//     // console.log(value[i])
//     if(val_ !== ":" || val_ !== "\n"){
//       if(prop && isLetter(val_) && !iswhitespace(val_)){
      
//          property += val_
      
//       }else{
//           val += val_
          
      
//       }       
//     }else if(val_ === ":"){
//       prop = false 
    
//     }
//    if(val_ === "\n"){
//         console.log("newLine")
//          ob[property] =val_
//          property = ""
//          value = ""
//          prop = true
    
//     }
    


// }
      

  return {
     type: "localState", 
     n: name,
     [name]: value,
     loc: {line, column}
  
  }


}

// lex a function(can be fn or function)
// followed by a name 
// open {
// code 
// closed }
lexer.prototype.fn = function(){


   
  
   let Fnidentifier = ""
   let args = []
   let temp = ""
   let Fnbody = ""
   let fnEnd = ""
    
    
   while(iswhitespace(this.char)){
        if(this.char === "\n") throw new Error(`expected a function identifier at ${this.line}:${this.column} but encountered a new line`)
        // buffer += this.char;
        this.next()
        
   
   }
   
   // getting the identifier
   
   while(!iswhitespace(this.char) && this.char !== "("){
    
      if(this.char === "\n") throw new Error(`expected a () after fn identifier at ${this.line}:${this.column} but encountered a new line`)   
      Fnidentifier += this.char
      this.next()
   
   }
   
    
   if(iswhitespace(this.char)){
     throw new Error(`expected a () after fn identifier at ${this.line}:${this.column} but encountered a whitespace`)   
   }else if(this.char === "("){
         this.next()
          
         while(this.char !== ")"){
          if(this.char === "\n") throw new Error(`expected a ) fn arguments at ${this.line}:${this.column} but encountered a new line`)   
            temp += this.char;
            this.next()
           
              
         }
         args = temp.split(",")
         if(this.char === "\n")  this.newLine();
              
         // let passingCode = true;
         while(iswhitespace(this.char)){
              if(this.char === "\n")  this.newLine()
           
             this.next()
         }
      
         if(this.char === "~"){
           
               this.next()
                while(!iswhitespace(this.char)){
                
                   fnEnd += this.char
                   this.next()
                }
                
                if(fnEnd !== "end"){
                
                   throw new SyntaxError(`expected end keyword at ${this.line}:${this.column} to end function ${Fnidentifier}`)
                }
        }else{
           // there must be code
            this.next()
           while(this.char !== "~"){
             if(this.char === "$" || this.char === undefined) {
                throw new SynataxError(`expected function body after identifier`)
            }
             if(this.char === "\n")  this.newLine()
             
            Fnbody += this.char;
            this.next()
           }
           // console.log("passing fn", args, Fnbody, this.char)
             
           
                this.next()
                
                while(isLetter(this.char)){
                
                   fnEnd += this.char
                   this.next()
                  
                }
                
                if(fnEnd !== "end"){
                
                   throw new SyntaxError(`expected end keyword at ${this.line}:${this.column} to end function ${Fnidentifier}`)
                }
   
           
           
           
           
        }
        
        
         
         
   }else{
     throw new Error(`expected a () after fn identifier at ${this.line}:${this.column} but encountered unkown char ${this.char}`)   
   }
   
   
   // console.log("passing fn", args, Fnbody, Fnidentifier)
   
 return {
   type: "function", 
   id: Fnidentifier, 
   body: Fnbody,
   args,
 
 }  


}

// make object for local state, data
lexer.prototype.textNode = function(){  
// console.log("calling textnode", this.char)
   if(this.char === undefined) return null;
   if(!isLetter(this.char)) return null;
   if(this.char !== "t") return null;
   let buffer = ""
   let value = ""
   let inState = false
   let col = gatherWhitespaces(this.input, this.cursor)
   while(isLetter(this.char)){
     buffer += this.char
     
   
     this.next()
   
   }
   let t = null
   
   
   if(buffer === "text"){
    
       while(this.char !== `"` && this.char !== "{"){
            // console.log(this.char)
          if(this.char === "\n") throw new Error(`expected a str or object path after text node ${this.line}:${this.column}`)
          this.next()
       
       }
       if(this.char === "{"){
          inState = true
       }
      this.next()
      
      while(this.char !== `"` && this.char !==  "}"){
         // console.log(value)
         value += this.char;
         this.next()
         if(this.char === "\n") throw new Error("could not find end of str or object path")
      
      }
   
     this.next()
   }
   
   return {
     type: "textNode",
     value,
     inState,
     loc: {line:this.line, column:col}
   
   }
   // only text node starts with a letter, $ will be held up by element
}
 
 lexer.prototype.component = function(){
    
       let buffer = ""
       if(this.char !== "~") return null;
       
       this.next()
         //  console.log(isLetter(this.char))
       while(isLetter(this.char) && this.char !== "\r" || this.char !== "\n"){
         //  console.log("is letter", this.char)
          buffer += this.char;
          this.next()
        
       
       }
       
       if(buffer.length >= 1 && iskeyword(buffer)){
 
              
              
           if(buffer.includes("start")){
               buffer = "Compstart"
              if(this.state.component.gotStart){
              
                 throw new Error("unclosed component somewhere")
              }else{
                 this.state.component.gotStart = true;
               
                
                 
              }
           
           }else if(buffer.includes("end")){
                   buffer = "Compend"
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
     
  


     if(this.char === "\n"){
      //   console.log("is NEW LINE IS PASSED AS WHITESPACE")
         return null
     }
    if(this.char === "\r"){
      //  console.log("slash r is passed as whitespace", iswhitespace('\r')) 
       return null
     }
    if(iswhitespace(this.char)){
      
      this.next()
    }
    
    while(iswhitespace(this.char)){
        this.next()
    }
 
 
     return null
 }
 
 
 
lexer.prototype.eol = function(){
      // console.log(this.char === "\n", "slashed n")
   //    console.log(this.char === "\r", "slashed r")
   //   if(this.char === "\r"){
   //      this.newLine()
   //      this.next()
   //      if(this.char === "\n") this.next()
   //      while(this.char === "\r"){
   //          this.newLine()
   //          this.next()
   //          if(this.char === "\n"){
   //            this.next()
   //          }
           
   //      }
     
   //      return true
   //   } 
      
      
   if(this.char === "\r" && this.peek() !== "\n"){
      this.newLine()
      this.next()
       
      while(this.char === "\r" && this.peek() !== "\n"){
         this.newLine()
         this.next()
         
      }
   }else if(this.char === "\r" && this.peek() === "\n"){
      this.newLine()
      this.next()
      this.next()

      while(this.char === "\r" && this.peek() === "\n"){
         this.newLine()
         this.next()
         this.next()
      }
   }
      
   if(this.char === "\n"){
   // console.log("EOL===============================================")
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
   
   // console.log("end of line returns")
   
   return true


}


 lexer.prototype.eof = function(){
      if(this.char === undefined){
          // console.log("end of file")
         return {
            type: "EOF"
         
         }
      }
      
      
      return null
 
 
 }
  
 // let  l = new lexer("dd.js", f)
 
 
// console.log(l.lex().next().value)
// console.log(l.lex().next().value)
// console.log(l.lex().next().value)
// console.log(l.lex().next().value)
// console.log(l.lex().next().value)


// console.log([...l.lex()])




//[] pass whitespace for components
