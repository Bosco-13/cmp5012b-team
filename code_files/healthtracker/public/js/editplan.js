function loadDish(data, container){
    title = container.querySelector(".result__header");
    title.text = data.food_title;
    image = container.querySelector("image");
    image.src = data.food__image;
    info = container.querySelector("p");
    info.text = 
    `Macros: \n
    Carb: ${data.calories} \n
    Fats: ${data.fat} \n
    Protein: ${data.protein} \n
    Ingridient:\n
    ${data.ingridient}`;
}

async function addDish(dishId){
    date = new Date();
    const {result, response} = await postjson('/editplan', {
        dishToAdd: dishId,
        datLogged: date
    });
    if (response.ok){
        console.log("dish added to day: " + date);
        console.log("dish id: " + dishId);
    }
}

addbuttons