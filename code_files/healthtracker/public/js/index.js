function loadTitle(username){
    document.querySelector("h1").text = "Welcome Back " + username;
}

//[calories, calories target, sleep, work out time, steps, steps target]
function loadData(array){
    cardTexts = document.querySelectorAll("p");
    cardTexts[0].text = array[0] + "/" + array[1];
    sleepHour = Math.floor(array[2] / (1000 * 60 * 60));
    sleepMintues = Math.floor((array[2] / (1000 * 60)) % 60);
    cardText[1].text = sleepHour + "h " + sleepMintues + "m";
    cardText[2].text = array[3] + "this week";
    cardText[3].text = array[4] + "/" + array[5];
}

