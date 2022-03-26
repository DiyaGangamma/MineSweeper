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

//Start - Code to enable and disable Sound effects
const soundtoggle = document.getElementById("soundtoggle");
soundtoggle.addEventListener("click", setSoundEffects);

function setSoundEffects(e) {
    e.preventDefault();
    const onOrOff = document.getElementById("soundOnOFF").textContent;
    if (onOrOff == "ON") {
        document.getElementById("soundOnOFF").textContent = "OFF";
        document.getElementById('onSoundId').src = "assets/nosound.png";
    }

    else {
        document.getElementById("soundOnOFF").textContent = "ON";
        document.getElementById('onSoundId').src = "assets/sound.png";
    }

}
//End

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


window.onload = function () {
    if (sessionStorage.length != 0) {
        var selItem = sessionStorage.getItem("mode");
        let element = document.getElementById("gameMode");
        element.value = selItem;
    }

}

function levelChange(){
    var e = document.getElementById("gameMode");
    var selVal = e.options[e.selectedIndex].text;
    sessionStorage.setItem("mode", selVal);
    document.location.reload(true)

}

function clearSessionStorage() {
    sessionStorage.clear();
}