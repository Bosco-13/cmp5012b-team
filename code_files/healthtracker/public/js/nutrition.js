const displaybuttons = document.querySelectorAll(".list__header__btn");

const ingridients = displaybuttons[0];
const recipe = displaybuttons[1];
const otherdishes = displaybuttons[2];

// num 0,1,2 - ingridients, recipe and otherdishes
function showHidden(num){
    content = document.querySelectorAll(".list__content")[num];
    contentStatus = content.display;
    if (contentStatus == "none"){
        content.display = "block";
    }
    else{
        content.display = "none";
    }
}
ingridients.addEventListener("click", showHidden(0));
recipe.addEventListener("click", showHidden(1));
otherdishes.addEventListener("click", showHidden(2));

// num 0,1,2 - ingridients, recipe and otherdishes
function loadRightInfo(num, text){
    content = document.querySelectorAll(".list__content")[num];
    content.text = text;
}

function loadLeftTitle(text){
    title = document.querySelector(".nutrition-title");
    title.text = text;
}

// data[int: Carbs, int: Fats, int: Protein]
function loadChart(data){
    carbs = data[0];
    fat = data[1];
    protein = data[2];
    totalMass = carbs + fat + protein;
    carbPercent = carbs/totalMass * 100;
    fatPercent = fat/tatalMass * 100;
    proteinPercent = protein/totalMass * 100;

    element.style.setProperty("--carbs", `${carbsPercent}%`);
    element.style.setProperty("--fat", `${fatPercent}%`);

    legends = document.querySelectorAll(".chart__legends__text");
    legends[0].text = "Carbs: " + carbsPercent + "%";
    legends[1].text = "Fats: " + fatPercent + "%";
    legends[2].text = "Protein: " + proteinPercent + "%";

    summary = document.querySelectorAll(".macro-text");
    summary[0].text = "Carbs: " + carbs + "g";
    summary[1].text = "Fats: " + fat + "g";
    summary[2].text = "Protein: " + protein + "g";
}

//data{dish:{
// title: String,
// carbs: Int,
// fats: Int,
// protein: Int,
// ingridients: String,
// recipe: String}}
document.addEventListener("DOMContentLoaded", () =>{
    fetch("http://localhost:3000/dish/:dishid")
    .then(response => response.json())
    .then(data => {
        title = data.dish.title;
        carbs = data.dish.carbs;
        fats = data.dish.fats;
        protein = data.dish.protein;
        ingridients = data.dish.ingridient;
        recipe = data.dish.recipe;
        loadRightInfo(0, ingridients);
        loadRightInfo(1, recipe);
        loadLeftTitle(title);
        loadChart([carbs, fats, protein]);
    })
})