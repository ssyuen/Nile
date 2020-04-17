console.log("███╗   ██╗██╗██╗     ███████╗\n");
console.log("████╗  ██║██║██║     ██╔════╝\n");
console.log("██╔██╗ ██║██║██║     █████╗\n");
console.log("██║╚██╗██║██║██║     ██╔══╝  \n");
console.log("██║ ╚████║██║███████╗███████╗\n");
console.log("Hey there fellow developer.\nHope you have a great day!");
// AJAX FOR GENRE CHECKBOXES
let gc = document.getElementById("genreContainer");
$(gc).change(function () {
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
var SEARCH_TYPE;
(function (SEARCH_TYPE) {
    SEARCH_TYPE["GENRE"] = "GENRE";
    SEARCH_TYPE["BINDING"] = "BINDING";
})(SEARCH_TYPE || (SEARCH_TYPE = {}));
var GENRE;
(function (GENRE) {
    GENRE["ADVENTURE"] = "ADVENTURE";
    GENRE["ANTHOLOGY"] = "ANTHOLOGY";
    GENRE["BIOGRAPHY"] = "BIOGRAPHY";
    GENRE["CARTOON"] = "CARTOON";
    GENRE["CHILDREN"] = "CHILDREN";
    GENRE["CLASSIC_AMERICAN"] = "CLASSIC_AMERICAN";
    GENRE["CLASSICS"] = "CLASSICS";
    GENRE["DYSTOPIAN"] = "DYSTOPIAN";
    GENRE["FANTASY"] = "FANTASY";
    GENRE["FICTION"] = "FICTION";
    GENRE["GRAPHIC_NOVEL"] = "GRAPHIC_NOVEL";
    GENRE["HORROR"] = "HORROR";
    GENRE["INTERNATIONAL"] = "INTERNATIONAL";
    GENRE["MYSTERY"] = "MYSTERY";
    GENRE["NON_FICTION"] = "NON_FICTION";
    GENRE["ROMANCE"] = "ROMANCE";
    GENRE["SCI_FI"] = "SCI_FI";
    GENRE["TEEN_YOUNG_ADULT"] = "TEEN_YOUNG_ADULT";
})(GENRE || (GENRE = {}));
var BINDING;
(function (BINDING) {
    BINDING["PAPAERBACK"] = "PAPAERBACK";
    BINDING["HARDBACK"] = "HARDBACK";
})(BINDING || (BINDING = {}));
