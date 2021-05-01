'use strict';

const audio = document.querySelector('#theAudio');
const canvasVar = document.querySelector('#myCanvas');
const playButton = document.querySelector('#play');
const pauseButton = document.querySelector('#pause');
const tags = document.querySelector('tags');
canvasVar.width = window.innerWidth - 100;
const canvasWidth = canvasVar.width;
const canvasHeight = canvasVar.height;
const lineWidth = 3;
let lineHeight = [];
let audioPaused = true;
let currentPosition =  0;
const SILVERCOLOR =  "#c8bdbd";
const REDCOLOR = "#ff9b9b";
playButton.addEventListener("click", function(){
  audio.play();
  playButton.classList.add('hidden');
  pauseButton.classList.remove('hidden');
});
pauseButton.addEventListener("click", function(){
  audio.pause();
  playButton.classList.remove('hidden');
  pauseButton.classList.add('hidden');
});
canvasVar.addEventListener('click', (event) => {
    const canvasContext = canvasVar.getContext('2d');
    audioPaused = true;
    audio.pause();
    // console.warn(canvasContext.isPointInPath(event.offsetX, event.offsetY));
    const calculateIndex = Math.floor((event.offsetX / lineWidth) / 2);
    if (currentPosition > calculateIndex) {
      canvasContext.beginPath();
      while(currentPosition > calculateIndex && currentPosition > 0) {
        changeColor(currentPosition, SILVERCOLOR);
        currentPosition--;
      }
      canvasContext.closePath();
    } else {
        canvasContext.beginPath();
        while(currentPosition <= calculateIndex && currentPosition < lineHeight.length) {
          changeColor(currentPosition, REDCOLOR);
          currentPosition++;
        }
        canvasContext.closePath();
    }
    audio.currentTime = calculateIndex * (audio.duration/lineHeight.length);
    audioPaused = false;
    setTimeout(() => {
        audio.play();
    }, 1000)
});
window.addEventListener('load', eventWindowLoaded, false);
function eventWindowLoaded() {
   pauseButton.classList.add('hidden');
   const canvasContext = canvasVar.getContext('2d');
   canvasContext.strokeStyle = SILVERCOLOR;
   canvasContext.lineWidth  = lineWidth;
   let widthReached = 2;
   lineHeight = [];
   while (widthReached <= (canvasWidth - 5)) {
    canvasContext.beginPath();
    const randomUpperHeight = Math.floor(Math.random() * (canvasHeight - Math.floor(canvasHeight/2) + 1)) + Math.floor(canvasHeight/2);
    const randomLowerHeight = Math.floor(Math.random() * (Math.floor(canvasHeight/2) - 0 + 1)) + 0;
    lineHeight.push([randomUpperHeight, randomLowerHeight, widthReached])
    canvasContext.moveTo(widthReached,randomUpperHeight);
    canvasContext.lineTo(widthReached,randomLowerHeight);
    canvasContext.stroke();   
    widthReached += lineWidth*2;
    canvasContext.closePath();
   }
   createTags('140','100','green', 'Introduction');
   createTags('100','180','cyan', 'One_six');
   createTags('130','300','#215805', 'Rapport Building - Empathy');
   createTags('100','1260','#b20a0a', 'Rapport Building - Energy');
}
audio.onloadedmetadata = function() {
    // alert(audio.duration);
};
audio.onplaying = function() {
    audioPaused = false;
    const interval = setInterval(function() {
        if (audioPaused) {
          clearInterval(interval); 
        } else {
          currentPosition < lineHeight.length ? changeColor(currentPosition, REDCOLOR) : '';
          currentPosition++;
        }
    }, audio.duration/lineHeight.length * 1000);
};
audio.onpause = function() {
    audioPaused = true;
};
function changeColor(index, color) {
    const canvasContext = canvasVar.getContext('2d');
    canvasContext.strokeStyle = color;
    canvasContext.lineWidth  = lineWidth;
    const [randomUpperHeight, randomLowerHeight, widthReached] = lineHeight[index];
    canvasContext.beginPath();
    canvasContext.moveTo(widthReached,randomUpperHeight);
    canvasContext.lineTo(widthReached,randomLowerHeight);
    canvasContext.stroke(); 
    canvasContext.closePath();
}
audio.onended = function() {
  playButton.classList.remove('hidden');
  pauseButton.classList.add('hidden');
}
function createTags(height, left, color, innerText) {
  const parentTag = document.querySelector('#tags');
  const tag = document.createElement('div')
  tag.style.width = '5px';
  tag.style.height = `${height}px`;
  tag.style.backgroundColor = color;
  tag.style.position = 'absolute';
  tag.style.left = `${left}px`;
  tag.style.bottom = `${canvasHeight/2}px`;

  const smallCircle = document.createElement('div');
  smallCircle.classList.add('circle');
  smallCircle.style.backgroundColor = color;
  smallCircle.style.left = `${left-5}px`;
  smallCircle.style.bottom = `${canvasHeight/2 - 1}px`;


  const rectangle = document.createElement('div');
  rectangle.classList.add('rectangle');
  rectangle.style.backgroundColor = color;
  rectangle.style.bottom = `${(canvasHeight/2) + Number(height)}px`;
  rectangle.innerHTML = innerText;
  parentTag.appendChild(tag);
  parentTag.appendChild(smallCircle);
  parentTag.appendChild(rectangle);
  const leftVar = left - Math.floor(rectangle.clientWidth / 2)
  rectangle.style.left = leftVar + rectangle.clientWidth > canvasWidth ? `${leftVar + (canvasWidth - (leftVar + rectangle.clientWidth)) + 10}px` : `${leftVar}px`;
}