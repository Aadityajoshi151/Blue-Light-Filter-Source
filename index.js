const { ipcRenderer } = require('electron');
const fs = require('fs');
//const schedule = require('node-schedule');
let newcolour
let opacity
let newcolourwithopacity

window.onload = LoadSettings();

function LoadSettings()

{
fs.readFile('C:/Blue Light Filter/user-settings.json', function (err, data) {
    if(err) 
    {
       settings = convertHex("#d0f159",15);
       document.body.style.backgroundColor = settings;
    }
    else
    {
        data = JSON.parse(data);
        settings = convertHex(data.colour,data.slidervalue);
        document.body.style.backgroundColor = settings;
        
    }
   
  });
}

            ipcRenderer.on('action-update-label', (event, arg) => {

                // Update the second window label content with the data sent from
                // the first window :) !
                newcolour = convertHex(arg.colour,arg.Transparencyvalue);
                document.body.style.backgroundColor = newcolour;
               
            });

            ipcRenderer.on('opacitysend', (event, arg) => {

                // Update the second window label content with the data sent from
                // the first window :) 
                newcolourwithopacity = convertHex(arg.colour,arg.Transparencyvalue);
                document.body.style.backgroundColor = newcolourwithopacity;
                
            });

            function convertHex(hex,opacity){
                hex = hex.replace('#','');
                r = parseInt(hex.substring(0,2), 16);
                g = parseInt(hex.substring(2,4), 16);
                b = parseInt(hex.substring(4,6), 16);
            
                result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
                return result;
            }

            ipcRenderer.on('restore-defaults', (event, arg) => {
                newcolour = convertHex("#d0f159",15);
                document.body.style.backgroundColor = newcolour;
                document.getElementById("colorselector").value = "#d0f159";
                document.getElementById("slidervalue").value = 15;
            });
            ipcRenderer.on("Second Instance" , (event, arg) => {
                alert("Blue Light Filter Is Already Running\nCheck The Tray Icon For More Details.")
            });


            


    