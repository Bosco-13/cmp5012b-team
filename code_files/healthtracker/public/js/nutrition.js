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
    content.textContent = text;
}

function loadLeftTitle(text){ // fixed
    title = document.querySelector(".nutrition-title");
    title.textContent = text;
}

// data[int: Carbs, int: Fats, int: Protein]
function loadChart(data){ //fixed
    carbs = data[0];
    fat = data[1];
    protein = data[2];
    totalMass = carbs + fat + protein;
    carbPercent = carbs/totalMass * 100;
    fatPercent = fat/totalMass * 100;
    proteinPercent = protein/totalMass * 100;

    element = document.querySelector(".pie-overlay");
    element.style.setProperty("--carbs", `${carbPercent}%`);
    element.style.setProperty("--fat", `${fatPercent}%`);

    legends = document.querySelectorAll(".chart__legends__text");
    legends[0].textContent = "Carbs: " + carbPercent.toPrecision(3) + "%";
    legends[1].textContent = "Fats: " + fatPercent.toPrecision(3) + "%";
    legends[2].textContent = "Protein: " + proteinPercent.toPrecision(3) + "%";

    summary = document.querySelectorAll(".macro-text");
    summary[0].textContent = "Carbs: " + carbs + "g";
    summary[1].textContent = "Fats: " + fat + "g";
    summary[2].textContent = "Protein: " + protein + "g";
}

//data{dish:{
// title: String,
// carbs: Int,
// fats: Int,
// protein: Int,
// ingridients: String,
// recipe: String}}

document.addEventListener("DOMContentLoaded", () =>{
    const id = 9
    fetch( `/nutrition/${id}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        dish = data.record[0]
        title = dish.food_title;
        nutritions = [dish.calories, dish.fat, dish.protein];
        ingridient = dish.ingridient;
        foodRecipe = dish.recipe;
        //left hand side
        loadLeftTitle(title);
        loadChart(nutritions);

        //right hand side
        //ingridient
        loadRightInfo(0, ingridients);
    })
})