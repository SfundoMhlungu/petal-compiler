
const keywords = ["start", "end", "text", "local"]





export function iswhitespace(c){
      const r = new RegExp("^\\s+")

     return r.test(c);


}





export function isLetter(c){
     const r = new RegExp("[a-zA-Z]")
     
     return r.test(c)

}



// console.log(isLetter("d"), "isletter")
export function iskeyword(word){
    let r = new RegExp(`^${keywords.join("|")}`)
    
    return r.test(word)   


}

// console.log(iskeyword("start"), "iskeyword")



// temp solution remember to fix
export function witOutSimilarObjects(childs){
// diealing a bug: i don't know where it came from
   // link: https://thewebdev.info/2021/02/23/how-to-remove-duplicates-from-an-array-of-objects-in-javascript/
   // console.log(childs, "=========================================================================================================")
     const result = childs.filter((thing, index, self) =>
      index === self.findIndex((t) => (
        JSON.stringify(t) === JSON.stringify(thing)
      ))
    )
// console.log(result)


    
   return result
}
