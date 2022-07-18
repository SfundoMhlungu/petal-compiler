



function parser(lexer, filename=""){
    // console.log([...lexer])
   let token = null
   let comp = false
   let component_ = {} 
   const prog = {
           name: filename,
           app: [
           
           
           ]
   
   }


   function next(){
   
      token = lexer.next().value
      
   }


// function State(){
// console.log(token, "TOK")
//      // if(token === undefined) return null;
//      if(token.type === "EOF") return token;
//       if(token.type === "Compstart") 
//         {comp = true } 
//       else if(token.type === "Compend") {comp = false }
      
      
      
//       return true
         
// }

// parser component
function component(){
        if(comp){
           // console.log("going over a comp", token)
           // return null
           if(token && token.type === "element"){
              if(!comp[0]){
                  // you must be a parent 
                 if(token.loc.column !== 0){
                     throw new SyntaxError(`the first element in a component must have 0 trailing spaces
                               which signifies it is a parent in ${filename}:${token.loc.line}:${token.loc.column} the compiler found
                                 ${token.loc.column} spaces`)
                   
                 }else{
                     token[4] = [] 
                     comp[0] =  token
                 
                 }
                 
              
              }else{
                if(comp[token.loc.column]){
                
                
                }else{
                   
                
                }
              
              
              }
           
           }
        
        }

 return null

}

// parse a single element

function outsideElement(){
  
   if(comp === true && token.type !== "Compend") {
      if(token.type === "EOF") return token
     console.log("NO NEED TO PASS YOU INSIDE A COMP============================================================")
     return null
   } 
   
   
   
   
   if(token && token.loc && token.loc.column > 0){
    console.warn(`an element outside a component cannot be a child so trailing space is ignored by the compiler
    ,if you want to make child relations put the following element in a .start and .end block at ${filename}:${token.loc.line}:${token.loc.column}
    `) 
   }
   
   if(token){
   
     return token 
   }else{
      return true
   
   }

}


 

next()
for(;;){
console.log("looping")
let parse =  outsideElement()
console.log(parse, "PARSE")
if(parse && parse.type === "Compstart"){
 comp = true;
 console.log("INSIDE A COMPONENT")
 
}else if(parse && parse.type === "Compend"){
  comp = false;
  console.log("OUTSIDE A COMP AGAIN")

}

if(parse){
    if(parse.type === "EOF"){
      console.log("end of file", parse)
      
      break;
   
   }
    else if(parse.type === "element"){
       console.log("GOT ELEMENT")
       prog.app.push(parse)
       
   }else if(parse === true){
      console.log("continue parsing")
   
   }
   
   
}

if(parse === undefined){
   throw new Error("expected EOF")

}

next()

}

console.dir(prog, {depth: null})


}



export default parser
