document.addEventListener('DOMContentLoaded', () => {
    const categoriesContainer = document.getElementById('categories-container');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const modal = document.getElementById('meal-modal');
    const closeModalButton = document.getElementById('close-modal-button');

    const allCategoriesUrl = 'https://www.themealdb.com/api/json/v1/1/categories.php';

    let allMeals = [];
    let searchedMeals = []; 


    fetch(allCategoriesUrl)
        .then(response => response.json())
        .then(data => {
            allMeals = data.categories;
        })
        .catch(error => console.error('Error fetching all categories:', error));


    searchButton.addEventListener('click', async () => {
        const searchTerm = searchInput.value.toLowerCase();
        searchedMeals = await fetchMealsByCategory(searchTerm);


        searchInput.value = '';


        displayMeals(searchedMeals);
    });

    searchInput.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {

            event.preventDefault();
    
            const searchTerm = searchInput.value.toLowerCase();
            searchedMeals = await fetchMealsByCategory(searchTerm);
    

            searchInput.value = '';

            displayMeals(searchedMeals);
        }
    });
    

    searchButton.addEventListener('click', async () => {
        const searchTerm = searchInput.value.toLowerCase();
        searchedMeals = await fetchMealsByCategory(searchTerm);
    

        searchInput.value = '';
    

        displayMeals(searchedMeals);
    });
    

    async function fetchRandomMeal() {
    const apiUrl = 'https://www.themealdb.com/api/json/v1/1/random.php';

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }

        const data = await response.json();
        return data.meals ? data.meals[0] : null; 
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return null;
    }
}

// Function to display a random meal on the page
async function displayRandomMeal() {
    const resultContainer = document.getElementById('random-meal');


    resultContainer.innerHTML = '';

    try {
        const meal = await fetchRandomMeal();


        if (meal) {
            resultContainer.innerHTML = `
                <div>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <br>
                    <span>---------------------------</span>
                    <h3>${meal.strMeal}</h3>
                </div>
            `;
        } else {
            resultContainer.innerHTML = '<p>No random meal found.</p>';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


window.addEventListener('load', displayRandomMeal);

    function createMealCard(meal) {
        return `
            <div class="meal-card" data-meal-id="${meal.idMeal}">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <span style="padding-top:20px;" >----------------------------</span>
                <h2>${meal.strMeal}</h2>
            </div>
        `;
    }


    function displayMeals(meals) {
        categoriesContainer.innerHTML = '';

        meals.forEach(meal => {
            const mealCard = createMealCard(meal);
            categoriesContainer.innerHTML += mealCard;
        });


        document.querySelectorAll('.meal-card').forEach(card => {
            card.addEventListener('click', () => {
                const mealId = card.getAttribute('data-meal-id');
                openModal(mealId);
            });
        });
    }


    async function openModal(mealId) {
        const mealDetailsUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;

        try {
            const response = await fetch(mealDetailsUrl);
            const data = await response.json();

            if (data.meals && data.meals.length > 0) {
                const meal = data.meals[0];


                document.getElementById('modal-image').src = meal.strMealThumb;
                document.getElementById('modal-title').textContent = meal.strMeal;
                document.getElementById('modal-ingredients').innerHTML = getIngredientsList(meal);
                document.getElementById('modal-instructions').textContent = meal.strInstructions;


                modal.style.display = 'block';
            } else {
                console.error('Meal details not found.');
            }
        } catch (error) {
            console.error('Error fetching meal details:', error);
        }
    }


    function getIngredientsList(meal) {
        let ingredientsList = '';
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];

            if (ingredient && measure) {
                ingredientsList += `<li>${measure} ${ingredient}</li>`;
            }
        }
        return ingredientsList;
    }


    function closeModal() {
        modal.style.display = 'none';
    }


    closeModalButton.addEventListener('click', closeModal);


    async function fetchMealsByCategory(category) {
        const categoryUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
        try {
            const response = await fetch(categoryUrl);
            const data = await response.json();
            return data.meals || [];
        } catch (error) {
            console.error('Error fetching meals by category:', error);
            return [];
        }
    }
});