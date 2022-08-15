import {writeFileSync} from "fs"
// import {fakeParseJSON} from "./JSONparser.js"
import {witOutSimilarObjects} from "./utils.js"
// console.log(objectParser.p)
function parser(lexer, filename=""){
    // console.log([...lexer])
   let token = null
   let comp = false
   let component_ = {} 
   const prog = {
           name: filename,
           functions: {},
           app: [
           
           
           ],
           state: {}
   
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
           // console.log(current, prev, "CURRENT AND PREV")
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

function State(){
        if(comp === true && token.type !== "Compend") {
      if(token.type === "EOF") return token
     // console.log("NO NEED TO PASS YOU INSIDE A COMP============================================================")
     return null
   } 
   
   if(token.type !== "localState") return null 
   
   
   return token


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
      if it's a data object ignore this warning
    `) 
   }
   
   if(token){
   
     return token 
   }else{
      return true
   
   }

}

function PassFn(){


   

   if(token.type === "function"){
     return token
   }
   
   
 
   return null
}

 

next()
for(;;){
// console.log("looping" ,token)
let parse =   PassFn() || outsideElement() || component() || State()
// console.log(parse, "PARSE")
if(parse && parse.type === "Compstart"){
 comp = true;
 // console.log("INSIDE A COMPONENT")
 
}else if(parse && parse.type === "Compend"){
  comp = false;
   // console.log(childs)
   // console.log("################################################")
   // console.dir(obj, {depth: null})
   // console.log(childs, "childs")
  childs = witOutSimilarObjects(childs)

  // console.log(obj)
 childs.forEach((c,i)=> {
        if(obj[`${c.parent}`] && obj[`${c.parent}`].children){
                 obj[`${c.parent}`].children.push(c)
        
        
        }else {
          // console.log(c.parent, c)
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
      // console.log("end of file", parse)
      
      break;
   
   }
    else if(parse.type === "element" || parse.type === "loop"){
       // console.log("GOT ELEMENT")
       if(parse.type === "loop"){
         // console.log(parse, "loooooop")
       }
       prog.app.push(parse)
       
   }else if(parse === true){
      // console.log("continue parsing")
   
   }else if(parse.type === "localState"){
      // const j = objectParser.p
      // console.log(parse[parse.n], "=====================================================")
   // console.log(fakeParseJSON(parse[parse.n]))
     prog.state[parse.n] = parse[parse.n]
   
   }else if(parse.type === "function"){
       prog.functions[parse.id] = parse
   
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


// witOutSimilarObjects(prog)


// console.dir(prog, {depth: null})
// prog.app.forEach((el)=> console.log("el======================",el))

// writeFileSync("../bin/compiled.json", JSON.stringify(prog), (err)=> {console.log(err)})




return prog


}



export default parser
