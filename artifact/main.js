/**
 * Night mode toggle
 */

 /*function getScript(source, callback) {
    var el = document.createElement('script');
     el.onload = callback;
    el.src = source;

    
    
    document.body.appendChild(el);
}*/


 
const darkModeToggle = document.getElementById("dark-mode-toggle");
darkModeToggle.addEventListener("click", toggleNightMode);

function toggleNightMode(e) {
    
    e.preventDefault();

    const state = document.body.classList.toggle('night') ? "ON" : "OFF";
if (state=="ON"){
     const state2 = document.querySelector('main');
     state2.style.backgroundColor='#1a0000';
 }
 else
 {
    const state2 = document.querySelector('main');
     state2.style.backgroundColor='#bdbdbd';
 }
     
 
 e.target.childNodes[1].textContent = state;
    
console.log(state)
    

}

// A temporary solution
/*const date = new Date();
const currentHour = date.getHours();
const nigthModeStartHour = 21;
const nigthModeEndHour = 7;
if (currentHour >= nigthModeStartHour || currentHour <= nigthModeEndHour) {
    darkModeToggle.click();
}*/

/**
 * Version fetcher
 */
function getVersion() {
    const versionEl = document.getElementById("version_string");

    fetch("https://api.github.com/repos/rdlf0/minesweeper/releases/latest", { method: "GET", headers: {} })
        .then(resp => resp.json())
        .then(body => versionEl.textContent = body.tag_name.substring(1))
}

getVersion();

/**
 * Browser dark mode - favicon switch
 */
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', chooseFavIcon);

const favIcon = document.querySelector('link[rel="icon"]');
function chooseFavIcon(e) {
    favIcon.href = e.matches ? favIcon.dataset.hrefDark : favIcon.dataset.hrefLight;
}

chooseFavIcon(window.matchMedia('(prefers-color-scheme: dark)'));
