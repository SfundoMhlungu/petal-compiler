
const keywords = ["start", "end"]


export function iswhitespace(c){
      const r = new RegExp("^\\s+")

     return r.test(c);


}





export function isLetter(c){
     const r = new RegExp("[a-zA-Z]")
     
     return r.test(c)

}



console.log(isLetter("d"), "isletter")
export function iskeyword(word){
    let r = new RegExp(`^${keywords.join("|")}`)
    
    return r.test(word)   


}

console.log(iskeyword("start"), "iskeyword")
