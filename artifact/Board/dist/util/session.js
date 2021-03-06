define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Session = void 0;
    class Session {
        constructor() { }
        static set(key, value) {
            Session.data.set(key, value);
            if (Session.get("debug")) {
                console.debug(`SESSION SET: ${key} = ${value}`);
            }
        }
        static get(key, defaultValue) {
            if (Session.data.has(key)) {
                return Session.data.get(key);
            }
            return defaultValue;
        }
        static clear() {
            if (Session.get("debug")) {
                console.debug("SESSION CLEARED");
            }
            Session.data.clear();
        }
        static toString() {
            return Array.from(Session.data).join("\r\n");
        }
    }
    exports.Session = Session;
    Session.data = new Map();
});

/*function darkmode(state){
           
   var col = document.getElementsByClassName("cell state-default");
  
            if (state =="OFF")
{  
     for (var i=0; i < col.length; i++) {
       // col[i].style.backgroundImage="url(./img.jpg)";
       col[i].style.backgroundColor='red';
            } 
       }
    else 
    {
     for (var i=0; i < col.length; i++) {
        col[i].style.backgroundColor="#cccccc" ;}

    }

        }*/
