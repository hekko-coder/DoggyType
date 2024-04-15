const str = 'in the lush garden a curious monkey chatters excitedly as it reaches for a ripe banana hanging from a swaying branch nearby a majestic lion rests peacefully under the shade of a towering tree its golden mane glistening in the warm sunlight a playful rabbit hops through the grass pausing occasionally to nibble on a juicy carrot overhead colorful kites dance gracefully in the breeze while a mischievous snake slithers silently through the underbrush among the vibrant flowers a cheerful child with a red hat giggles with delight as they pick ripe apples and plump oranges in the distance the distant call of a majestic tiger echoes through the jungle adding to the symphony of nature the quick brown fox jumped over the lazy dog';
const words = str.split(" ");
const gameTime = 60*1000;

window.gameStart = null;

function addClass(el, name) {
   el.className += ' '+name;
}

function removeClass(el, name) {
   el.className = el.className.replace(name, "");
}

console.log(words)

function randomWord(){

    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

function formatWord(word){
    return `<div class = "word">
    <span class="letter">${word.split("").join('</span><span class = "letter">')}</span>
    </div>`;  
}

//function for new game
function newGame() {
    document.getElementsByClassName("words").innerHTML = '';
    for(let i = 0; i < 200; i++)
    {
        document.getElementsByClassName("words")[0].innerHTML += formatWord(randomWord());
       
    }
    addClass(document.querySelector(".word"),'current');
// 
    addClass(document.querySelector('.letter'), 'current');
    document.getElementById("info").innerHTML = (gameTime/1000)+"";
    window.timer = null;
}
function getWpm(){
    const words = [...document.querySelectorAll('.word')];
    const lastTypeWord = document.querySelector(".word.current");
    const lastTypedWordIndex = words.indexOf(lastTypeWord);
    const typedWords = words.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        const incorrectLetters = letters.filter(letter => letter.className.includes("incorrect"));
        const correctLetters = letters.filter(letter => letter.className.includes("correct"));
        return incorrectLetters.length === 0 && correctLetters.length === letters.length;
    });
    return (correctWords.length/gameTime*60000) ;
}

function gameOver() {
    
    clearInterval(window.timer);
    addClass(document.getElementById("game"), 'over');
    const result =  getWpm();
    document.getElementById("info").innerHTML = `WPM : ${result}`
    
    
    
}


document.getElementsByClassName("game")[0].addEventListener('keyup', ev =>{
    const key = ev.key;
    const currentWord = document.querySelector('.word.current')
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter?.innerHTML || " ";
    const isLetter = key.length === 1 && key !== " ";
    const isSpace = key === " ";
    const isBackspace = key === "Backspace";
    const isFirstLetter = currentLetter === currentWord.firstElementChild;

    if(document.querySelector("#game.over"))
    {
        return;
    }
    
    
    console.log({key, expected});

     //timer
     if(!window.timer && isLetter) 
     {
        window.timer = setInterval(() =>{
            
               if(!window.gameStart) //when null
               {
                window.gameStart = (new Date()).getTime();
               }
               const currentTime =  (new Date()).getTime();
               const mPass = currentTime - window.gameStart;
               const sPass = Math.round(mPass /1000)
               const sLeft = (gameTime/1000) -  sPass;
               if(sLeft <= 0)
               {
                gameOver();
                return;
               }
               document.getElementById("info").innerHTML = sLeft + " ";
              
        }, 1000);
     
     }


    if (isLetter) {
        if (currentLetter) {
            addClass(currentLetter, key === expected ? "correct" : "incorrect");
            removeClass(currentLetter, "current");
            if (currentLetter.nextSibling) {
                addClass(currentLetter.nextSibling, "current");
            }
        }
        //for extra letter
        // else {
        //     if(currentWord.previousSibling)
        //     {

        //         const incorrectLetter=document.createElement("span");
        //         incorrectLetter.innerHTML = key;
        //         incorrectLetter.className = "letter incorrect extra";
        //         currentWord.appendChild(incorrectLetter);
        //     }
        //     }
    }

    if (isSpace) {
        if (expected !== " ") {
            const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
            lettersToInvalidate.forEach(letter => {
                addClass(letter, "incorrect");
            });
        }
        removeClass(currentWord, "current");
       addClass(currentWord.nextSibling, "current");
    //   
    if(currentLetter){
        removeClass(currentLetter, "current");
    }
    addClass(currentWord.nextSibling.firstChild.nextSibling, "current");

    }

    if(isBackspace)
    {
        // console.log(currentWord.previousSibling.lastElementChild)
        
  
        if(currentLetter && isFirstLetter && currentWord.previousSibling)
        {

            removeClass(currentWord,"current");
            addClass(currentWord.previousSibling,"current");
            removeClass(currentLetter, "current");
            addClass(currentWord.previousSibling.lastElementChild, "current");
            removeClass(currentWord.previousSibling.lastElementChild, "incorrect");
            removeClass(currentWord.previousSibling.lastElementChild, "correct");   
            
          
        }
        // if(currentLetter && !isFirstLetter && currentWord.previousSibling)
        // {
        //     removeClass(currentWord,"current");
        //     addClass(currentWord.previousSibling,"current");
        //     removeClass(currentLetter, "current");
        //     addClass(currentWord.previousSibling.lastElementChild, "current");
        //     removeClass(currentWord.previousSibling.lastElementChild, "incorrect");
        //     removeClass(currentWord.previousSibling.lastElementChild, "correct"); 
        // }
        if(currentWord.previousSibling && currentLetter && !isFirstLetter && currentLetter.previousSibling)
        {
           removeClass(currentLetter , "current");
           addClass(currentLetter.previousSibling, 'current');
           removeClass(currentLetter.previousSibling, "incorrect");
            removeClass(currentLetter.previousSibling, "correct"); 

        }
        if(!currentWord.previousSibling && currentLetter && !isFirstLetter && currentLetter.previousSibling)
        {
           removeClass(currentLetter , "current");
           addClass(currentLetter.previousSibling, 'current');
           removeClass(currentLetter.previousSibling, "incorrect");
            removeClass(currentLetter.previousSibling, "correct"); 

        }
        if(!currentLetter)
        {
          addClass(currentWord.lastElementChild,"current")
          removeClass(currentWord.lastElementChild, "incorrect");
            removeClass(currentWord.lastElementChild, "correct"); 
        }
               
    }

    //movelines , words //scrooling
    if(currentWord.getBoundingClientRect().top > 150 ){
     const words = document.getElementById("words");
     const margin = parseInt(words.style.marginTop || "0px");
     words.style.marginTop =   (margin-35)+ "px";
    
    }
    



   //move cursor
   const nextLeter = document.querySelector(".letter.current");
   const nextWord = document.querySelector(".word.current");
   const cursor = document.getElementById("cursor");
   cursor.style.top = (nextLeter || nextWord).getBoundingClientRect().top + 2 + "px";
   cursor.style.left = (nextLeter || nextWord).getBoundingClientRect()[nextLeter ? "left" : "right"] + 1 + "px";

  

});

document.getElementById("button").addEventListener("click", () => {

   document.getElementById("game").focus();
    location.reload();
    
    
  
       
 })

newGame();

