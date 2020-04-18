import {replaceBtn} from "./utility/util.js";

$("#loginForm").on("submit", function () {
    replaceBtn("#loginBtn");
});

$("#loginBtn").on("click", function () {
    $("loginForm").submit();
});