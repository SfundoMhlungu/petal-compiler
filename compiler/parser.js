



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
let prev = null
let current = null


let obj = {}
let childs = []

let parentIDs = 0


function component(){
      if(comp){
           prev = current
           current = token
          if(prev === null){
            // looking at the first one 
            
            if(current.loc.column !== 0){
              throw new SyntaxError(`first element must 0 spaces ${current.loc.line, current.loc.column}`)
            }
            
            obj['root'] = current 
          }else if(prev.loc.column+4 === current.loc.column){
                  current['parent'] = parentIDs
                   childs.push(current)
                  obj[parentIDs] = prev
                  parentIDs++
                 
                  
              // if(prev.children){
              //     current['parent'] = prev
              //     prev.children.push(current)
                  
              // }else{
              //    current['parent'] = prev
              //    prev["children"] = [current]
              // }
          
          }else if(prev.loc.column === current.loc.column){
                 current['parent'] = prev.parent
                  childs.push(current)
          
          }
          
          else if(current.loc.column < prev.loc.column){
          
              Object.keys(obj).forEach((key, i)=> {
                     if(obj[key].loc.column === current.loc.column){
                         current["parent"] = obj[key].parent
                         childs.push(current);
                        return
                     }
              
              
              })
             // l.parent.children.push(current)
          
          }
      
      
      }
  

  // if(comp){
  //    return null
  //  }
  //  else {
   
   
  //   console.log(childs)
  //  console.log("################################################")
  //  console.dir(obj, {depth: null})
  //  childs = []
  //  obj = {}
  //      return true 
  //  }


return null

}

// parse a single element

function outsideElement(){
  
   if(comp === true && token.type !== "Compend") {
      if(token.type === "EOF") return token
     // console.log("NO NEED TO PASS YOU INSIDE A COMP============================================================")
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
// console.log("looping")
let parse =  outsideElement() || component()
console.log(parse, "PARSE")
if(parse && parse.type === "Compstart"){
 comp = true;
 console.log("INSIDE A COMPONENT")
 
}else if(parse && parse.type === "Compend"){
  comp = false;
   console.log(childs)
   console.log("################################################")
   console.dir(obj, {depth: null})
 
  console.log("OUTSIDE A COMP AGAIN")
  
 childs.forEach((c,i)=> {
        if(obj[`${c.parent}`] && obj[`${c.parent}`].children){
                 obj[`${c.parent}`].children.push(c)
        
        
        }else {
        
          obj[c.parent].children = [c] 
        
        }
               
    
         
         
 
 })
  prog.app.push(obj)
    childs = []
   obj = {}
   prev = null
   current = null
  

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





prog.app.forEach((obj, i)=> {
      if(obj.root){
          Object.keys(obj).forEach((key, i)=> {
          
              if(key !== "root"){
              
                  Reflect.deleteProperty(obj, key)
              
              }
          
          
          })
         
      
      
      }




})



// console.dir(prog, {depth: null})



return prog


}



export default parser
