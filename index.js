const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");
const ageInput = document.getElementById("age");
const genderInput = document.getElementById("gender");
const activityInput = document.getElementById("level");

const submit = document.getElementById("generatebtn");

const cardContainer = document.getElementById("cards-container");
const mealsDetails = document.getElementById("details");
const ingredientSection = document.getElementById("ingredients");
const stepsSection = document.getElementById("steps");
const equipmentSection = document.getElementById("equipment");
const recipeSection = document.getElementById("recipe-section");

const apiKey = "0ed052bdd4cc4a3dbe7e7c61edae3c1b";



const getCalorie = () => {
    let height = heightInput.value;
    let weight = weightInput.value;
    let age = ageInput.value;
    let gender = genderInput.value;
    let physicalActivity = activityInput.value;

    if (height <= 0 || weight <= 0 || age <= 0) {
        alert("Please enter valid height, weight and age");
        return;
    }

    let BMR;
    if (gender === "female") {
        BMR = 655.1 + 9.563 * weight + 1.85 * height - 4.676 * age;
    } else {
        BMR = 66.47 + 13.75 * weight + 5.003 * height - 6.755 * age;
    }

    if (physicalActivity === "light") BMR *= 1.375;
    if (physicalActivity === "moderate") BMR *= 1.55;
    if (physicalActivity === "active") BMR *= 1.725;

    getMeals(Math.round(BMR));
};



const getMeals = async (BMR) => {
    document.getElementById("loader").style.display = "block";

    let url = `https://api.spoonacular.com/mealplanner/generate?timeFrame=day&targetCalories=${BMR}&apiKey=${apiKey}&includeNutrition=true`;

    let res = await fetch(url);
    let data = await res.json();

    generateMealsCard(data);

    document.getElementById("loader").style.display = "none";
};



const generateMealsCard = (datas) => {
    
    mealsDetails.innerHTML = `
        <h2 style="text-align:center; margin-top:20px;">Nutrients</h2>
        <p style="text-align:center;">Calories: ${datas.nutrients.calories}</p>
        <p style="text-align:center;">Carbs: ${datas.nutrients.carbohydrates}</p>
        <p style="text-align:center;">Fat: ${datas.nutrients.fat}</p>
        <p style="text-align:center;">Protein: ${datas.nutrients.protein}</p>
    `;

    cardContainer.style.display = "flex";
    cardContainer.style.flexWrap = "wrap";
    cardContainer.style.gap = "2rem";
    cardContainer.style.justifyContent = "center";

    let cards = "";

    datas.meals.forEach(async (meal) => {
        const url = `https://api.spoonacular.com/recipes/${meal.id}/information?apiKey=${apiKey}`;

        let response = await fetch(url);
        let result = await response.json();

        cards += `
        <div style="width: 300px; border:1px solid #ddd; border-radius:10px; padding:10px;">
            <img src="${result.image}" style="width:100%; border-radius:8px;">
            <h5 style="margin-top:10px; text-align:center;">${meal.title}</h5>
            <p style="text-align:center;">Preparation Time: ${meal.readyInMinutes} minutes</p>
            <button >
                onclick="btnRecipe(${meal.id})"
                style="display:block; margin:auto; padding:5px 12px; border-radius:6px; background:#6cb165; color:white; border:none;">
                Get Recipe
            </button>
        </div>
        `;

        cardContainer.innerHTML = cards;
    });
};


const btnRecipe = async (id) => {
    recipeSection.innerHTML = "";
    ingredientSection.innerHTML = "";
    stepsSection.innerHTML = "";
    equipmentSection.innerHTML = "";

    const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;
    const res = await fetch(url);
    const info = await res.json();

    recipeSection.innerHTML = `
        <h2 style="text-align:center; margin:20px 0;">
            ${info.title} Recipe
        </h2>
    `;

    
    let ingredHTML = info.extendedIngredients.map(i => `<li>${i.original}</li>`).join("");

    ingredientSection.innerHTML = `
        <div style="border:1px solid #ccc; padding:15px; border-radius:8px;">
            <h3 style="text-align:center;">INGREDIENTS</h3>
            <ul>${ingredHTML}</ul>
        </div>
    `;

    
    let stepsHTML = info.analyzedInstructions[0].steps.map(s => `<li>${s.step}</li>`).join("");

    stepsSection.innerHTML = `
        <div style="border:1px solid #ccc; padding:15px; border-radius:8px;">
            <h3 style="text-align:center;">STEPS</h3>
            <ol>${stepsHTML}</ol>
        </div>
    `;

    
    const equipURL = `https://api.spoonacular.com/recipes/${id}/equipmentWidget.json?apiKey=${apiKey}`;
    const eqRes = await fetch(equipURL);
    const eqData = await eqRes.json();

    let equipmentList = eqData.equipment.map(e => `<li>${e.name}</li>`).join("");

    equipmentSection.innerHTML = `
        <div style="border:1px solid #ccc; padding:15px; border-radius:8px;">
            <h3 style="text-align:center;">EQUIPMENT</h3>
            <ul>${equipmentList}</ul>
        </div>
    `;

    
    document.querySelector("#ingredients").style.width = "33%";
    document.querySelector("#steps").style.width = "33%";
    document.querySelector("#equipment").style.width = "33%";

    document.querySelector("#ingredients").style.padding = "10px";
    document.querySelector("#steps").style.padding = "10px";
    document.querySelector("#equipment").style.padding = "10px";

    document.querySelector("#ingredients").style.textAlign = "left";
    document.querySelector("#steps").style.textAlign = "left";
    document.querySelector("#equipment").style.textAlign = "left";

    
    document.querySelector("#ingredients").parentElement.style.display = "flex";
    document.querySelector("#ingredients").parentElement.style.justifyContent = "space-evenly";
};
 


submit.addEventListener("click", getCalorie);

