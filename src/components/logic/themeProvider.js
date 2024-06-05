import themeParser from "./themeParser";

function initTheme(theme){
    try {
        themeParser(theme)
    } catch (error) {
        console.log(error)
    }
}

