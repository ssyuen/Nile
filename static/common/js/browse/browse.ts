console.log("███╗   ██╗██╗██╗     ███████╗\n");
console.log("████╗  ██║██║██║     ██╔════╝\n");
console.log("██╔██╗ ██║██║██║     █████╗\n");
console.log("██║╚██╗██║██║██║     ██╔══╝  \n");
console.log("██║ ╚████║██║███████╗███████╗\n");
console.log("Hey there fellow developer.\nHope you have a great day!");

// AJAX FOR GENRE CHECKBOXES
let gc: HTMLInputElement = document.getElementById("genreContainer") as HTMLInputElement;
$(gc).change(function(){
    let genresChecked = $(".genre:checkbox:checked");
    for (let genre in genresChecked) {
        console.log(genre);
    }
    
    // $.ajax({
    //     url:"/",
    //     type: "POST",
    //     data: {'flag':SEARCH_TYPE.GENRE,'genre'}
    // });
});

// AJAX FOR BINDING



enum SEARCH_TYPE {
    GENRE = "GENRE",
    BINDING = "BINDING"
}

enum GENRE {
    ADVENTURE = "ADVENTURE",
    ANTHOLOGY = "ANTHOLOGY",
    BIOGRAPHY = "BIOGRAPHY",
    CARTOON = "CARTOON",
    CHILDREN = "CHILDREN",
    CLASSIC_AMERICAN = "CLASSIC_AMERICAN",
    CLASSICS = "CLASSICS",
    DYSTOPIAN = "DYSTOPIAN",
    FANTASY = "FANTASY",
    FICTION = "FICTION",
    GRAPHIC_NOVEL = "GRAPHIC_NOVEL",
    HORROR = "HORROR",
    INTERNATIONAL = "INTERNATIONAL",
    MYSTERY = "MYSTERY",
    NON_FICTION = "NON_FICTION",
    ROMANCE = "ROMANCE",
    SCI_FI = "SCI_FI",
    TEEN_YOUNG_ADULT = "TEEN_YOUNG_ADULT"
}

enum BINDING {
    PAPAERBACK = "PAPAERBACK",
    HARDBACK = "HARDBACK"
}