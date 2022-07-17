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
            let token = this.whitespace() || this.component() 
            || this.element() || this.textNode() || this.skipletter() || this.eol()
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
      
      this.next()
      let element = ""
    let attrName_ = null;
    let attrValue = null;
      let attrName = true
      let attrs = {}
      let checkedFirstLetter = false
      
      // passing element only 
      while(!iswhitespace(this.char) && this.char !== "\n"){
           console.log(this.char)
           if(!checkedFirstLetter){
             checkedFirstLetter = true
             if(!isLetter(this.char)) throw new Error("expected an element shortly after $ sign at")
           }
         
          element += this.char 
          this.next()
          
         // console.log(element)
      }// if encounters a whitespace or new line it will break
      
      if(this.char === "\n") return null
         console.log(this.char, "after getting ele")
      while(this.char !== "\n" ){
      
         while(iswhitespace(this.char)) {
             console.log(this.char, "iswhitespace")
           this.next()
          if(this.char === "\n") break;
         }
         
         
         if(isLetter(this.char) || this.char === `"`){
             // either attr or value
             console.log(this.char, "is letter")
             let buffer = ""
             while(isLetter(this.char)){
                console.log('DOING LETTER PASSING')
                buffer += this.char
                console.log(buffer, "buffer")
                this.next() 
             }
             // if(this.char !== `"`) return null
              // SUPPOSADLEY GOT ATTRSVALUE  
            if(this.char === `"`){
               console.log("parsing str")
                this.next()
               while(this.char !== `"`){
                 buffer += this.char
                 console.log(buffer, "DOING STR PASSING")
                 this.next()
               
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
      console.log('FOUND NEW LINE')
      // this means we have attribs
 const el =  {
     type: "element", 
     node: element,
     attrs
   
   }
   console.log(el)
   return el

}

lexer.prototype.textNode = function(){  
console.log("calling textnode", this.char)
   if(this.char === undefined) return null;
   if(!isLetter(this.char)) return null;
   let buffer = ""
   let value = ""
   while(isLetter(this.char)){
     buffer += this.char
   
     this.next()
   
   }
   let t = null
   
   
   if(buffer === "text"){
       while(this.char !== `"`){
          if(this.char === "\n") throw new Error("expected a str after text node")
          this.next()
       
       }
       
      this.next()
      
      while(this.char !== `"`){
         value += this.char;
         this.next()
         if(this.char === "\n") throw new Error("could not find end of str")
      
      }
   
   
   }
   
   return {
     type: "textNode",
     value
   
   }
   // only text node starts with a letter, $ will be held up by element
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
