const { ipcRenderer } = require('electron');
const fspath  = require("fs-path");
const {remote} = require('electron');
var colourreceived;
var opacity;
var temp;
var timepiece;

document.getElementById('close').addEventListener('click',closeWindow); 
function closeWindow()
{
  var window = remote.getCurrentWindow();             //Close Window Function
  window.close();
}
function ChangeColour(t)
{
    colourreceived = t.value;
    if(colourreceived == "#000000"  || colourreceived == "#ffffff")
    {
        alert("Black and White Colours Cannot Be Selected");
        t.value = "#d0f159";
        colourreceived = t.value;
    }
    let FilterColor = {
        colour: colourreceived,
        Transparencyvalue: document.getElementById("slider").value
    };
    ipcRenderer.send('request-update-label-in-second-window' , FilterColor);
}

function changeopacity(t)
{
    let opacity =  t.value;
    let Transparency = {
        colour: document.getElementById("colorselector").value,
        Transparencyvalue: opacity
    };
    ipcRenderer.send('opacityreceive' , Transparency);
}

document.getElementById("btn").addEventListener("click" , function(){
 
    let settings = {
        colour: document.getElementById("colorselector").value,
        slidervalue: document.getElementById("slider").value,
    };    
    settings = JSON.stringify(settings);
    fspath.writeFile("C:/Blue Light Filter/user-settings.json" , settings , (error) => {
        if (error)
        {  
            return;          
        }
        alert("Settings Saved");
        ipcRenderer.send("Quit");
    })
})
document.getElementById("defaults").addEventListener("click" , function(){
    ipcRenderer.send("restore");
})
