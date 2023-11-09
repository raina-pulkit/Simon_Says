// Making list of audio objects ____________________________________
var audios = [];
var buttons = $(".clicker");
for(var i = 0; i<4; i++){
    var loc = "sounds/"+buttons[i].classList[1]+".mp3";
    var s = new Audio(loc);
    audios[buttons[i].classList[1]] = s;
}
audios['wrong'] = new Audio("sounds/wrong.mp3");
//___________________________________________________________________

var state = false;
var seq = [];
var lvl = 0;

var done = 0;

var dic = {
    0: 'green',
    1: 'red',
    2: 'blue',
    3: 'yellow'
};

const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

function startGame(){
    $(document).keypress(function (){
        if(!state){
            seq = [];
            lvl = 0;
            state = true;
            gamePlaying();
        }
    });
}

function randomGen(){
    var x = Math.floor(Math.random()*4);
    return dic[x];
}

function gameOver(){
    state = false;
    $(".container > h1").text("Sorry Game Over at level "+lvl+". Press any key to start again.");
    //add gameover animation
    done = 0;
    audios['wrong'].play();
    $(".container").addClass("flash");
    setTimeout(function(){
        $(".container").removeClass("flash");
    }, 600);
    startGame();
}


async function gamePlaying(){
    if(state){
        $(".container > h1").text("Level "+(++lvl));
        seq.push(randomGen());
        console.log(seq);
        for(var i = 0; i<seq.length; i++){
            $("."+seq[i]).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
            audios[seq[i]].play();
            await sleep(800);
        }
    } 
}

function checkSequence(currLvl, inp){
    //Change state to false if wrong
    //if right increase done by one

    if(seq[currLvl] === inp){
        done++;
    }
    else{
        state = false;
        gameOver();
    }

}

function getPromiseFromEvent(item, event){
    return new Promise((resolve) => {
        const listener = () => {
            item.removeEventListener(event, listener);
            resolve();
        }
        item.addEventListener(event, listener);
    });
}

// //wait for keyboard press first
// async function waitForKeys(){
//     startGame();
//     await getPromiseFromEvent(document, "keypress");
// }
// waitForKeys();
// console.log("BYEBYYE");

// async function gaming(){
//     gamePlaying();
//     await getPromiseFromEvent($("clicker"), "click");
// }

// gaming();

startGame();


$(".clicker").click(function (e){
    if(state){
        var clicked = ".clicker."+e.currentTarget.classList[1];
        $(clicked).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
        audios[e.currentTarget.classList[1]].play();
        
        console.log("HELLO" + e.currentTarget.classList[1]);
        if(state){
            console.log("Comparison: " + e.currentTarget.classList[1]+ " " + seq[done]);
            if(e.currentTarget.classList[1] == seq[done]){
                done++;
            }
            else{
                gameOver();
            }
            if(done == seq.length){
                done = 0;
                setTimeout(gamePlaying, 1000);
            }
        }
    }
});