let fetchedTheme = "";

function themeParser(theme) {
    function fetchTheme(theme) {
        const baseLocation = "themes/";
        fetch(baseLocation.theme + "_theme.json")
            .then((response) => response.json())
            .then((data) => fetchedTheme = data )
            .catch((error) => console.error("Parser error:", error));

            return fetchedTheme;
    }
    function parseTheme(fetchedTheme){
        
    }  

    return fetchTheme(theme);
}

export default themeParser;