local data {}
local talents {}







~start 

$div class "nsf" id "sji"
    text "node"

    $p class "id"
        text "noriyega"
    $section class "em"  
        $p class "m"
            text  "Sed ut perspiciatinventore verita nulla pariatur"
            $button onclick print
                text "this is a button"
        $div class "explanation, ll" onclick hide
            $h1 
                text "I made this, spaces are important"
        $form
            $label
                text "i should definetley"
            $input placeholder "bottomless"
        $div 
            for person in data.persons  
                $label
                    text (person.name)
                $label
                    text (person.age)
                $img src (person.avatar)
               
~end                       

$img src "1.jpg" id "uyh"
$img src "2.png" id "m"
   $br

~start

$div id "jjn"
    $label
        text "hello world"
    for talent in talents
        $label
            text (talent.name)
        $label
            text (talent.level)
    

~end
