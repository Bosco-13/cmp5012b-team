const displaybuttons = document.querySelectorAll(".list__header__btn");

const ingridients = displaybuttons[0];
const recipe = displaybuttons[1];
const otherdishes = displaybuttons[2];

// num 0,1,2 - ingridients, recipe and otherdishes
function loadRightInfo(num, text){
    console.log(num);
    content = document.querySelectorAll(".list__content")[num];
    contentList = text.split("\n\t");
    console.log(contentList);
    ol = content.querySelector("ol");
    for(i = 0; i < contentList.length; i++){
        console.log(i);
        li = document.createElement("li");
        console.log(li);
        li.textContent = contentList[i];
        ol.appendChild(li);
    }
}

function loadLeftTitle(text){ // fixed
    title = document.querySelector(".nutrition-title");
    title.textContent = text;
}

// data[int: Carbs, int: Fats, int: Protein]
function loadChart(data){ //fixed
    console.log(data);
    carbs = data[3];
    fat = data[1];
    protein = data[2];
    calories = data[0]
    
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

    caloriesText = document.getElementsByClassName("calories")[0];
    console.log(caloriesText);
    caloriesText.textContent = `${calories}cal`;
}

//data{dish:{
// title: String,
// carbs: Int,
// fats: Int,
// protein: Int,
// ingridients: String,
// recipe: String}}

document.addEventListener("DOMContentLoaded", () =>{
    const id = sessionStorage.getItem("dish_id");
    sessionStorage.removeItem("dish_id");
    console.log(id);
    fetch( `/nutrition/${id}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        dish = data.record[0]
        title = dish.food_title;
        nutritions = [dish.calories, dish.fat, dish.protein, dish.carbs];
        ingridient = dish.ingridient;
        foodRecipe = dish.receipe;
        //left hand side
        loadLeftTitle(title);
        loadChart(nutritions);

        //right hand side
        //ingridient
        loadRightInfo(0, ingridient);
        //console.log(foodRecipe);
        loadRightInfo(1, foodRecipe);
        let hideShowButtons = document.getElementsByClassName("list__header__btn");
        listContentArray = document.getElementsByClassName("list__content");
        for(let i = 0; i<hideShowButtons.length; i++){
            hideShowButtons[i].addEventListener("click", function (){
                if(this.textContent == "-"){
                    this.textContent = "+";
                    listContentArray[i].style.display="block";
                }
                else{
                    this.textContent = "-";
                    listContentArray[i].style.display = "none";
                }
            })
        }
    })
})

