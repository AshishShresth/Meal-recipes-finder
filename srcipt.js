const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  category = document.getElementById('category'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal'),
  meal_categoryEl = document.getElementById('list-category');

// Search meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  // Clear single meal
  single_mealEl.innerHTML = '';
  meal_categoryEl.innerHTML = '';

  // Get search term
  const term = search.value;

  // Check for empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json()) // returns a promise and we need to format that response to json which also returns another promise which is the data
      .then((data) => {
        // console.log(data);
        resultHeading.innerHTML = `<h2>Search results for '${term}' : </h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try agian!</P>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
            <div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                <div class="meal-info" data-mealID="${meal.idMeal}">
                  <h3>${meal.strMeal}</h3>
                </div>
            </div>
          `
            )
            .join(''); // map returns an array so to turn it into a string we use join
        }
      });
    // Clear search text
    search.value = '';
  } else {
    alert('Please enter a search term');
  }
}

// Fetch meal by Id
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

// Fetch meals by Category
// function getMealsByCategory()

// Fetch random meal from API
function getRandomMeal() {
  // Clear meals and heading
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';
  meal_categoryEl.innerHTML = '';

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const randomMeal = data.meals[0];

      addMealToDOM(randomMeal);
    });
}

// Fetch list of category from API
function listCategory() {
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';
  single_mealEl.innerHTML = '';

  fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    .then((res) => res.json())
    .then((data) => {
      const mealCategory = data.categories;
      addMealCategoryToDom(mealCategory);
    });
}

// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</P>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

// Add meal category to DOM
function addMealCategoryToDom(mealCategory) {
  meal_categoryEl.innerHTML = `
  <h1>Meal Categories</h1>
    ${mealCategory
      .map(
        (cat) => `
      <div class = "category">
            
        <div class="cat-info" data-category-name="${cat.strCategory}">
        <img src="${cat.strCategoryThumb}" alt="${cat.strCategory}"/> 
          <h2>${cat.strCategory}</h2>
          <h3>${cat.strCategoryDescription}</h3>
        </div>
      </div>
    `
      )
      .join('')} 
  `;
}

// Event listeners
submit.addEventListener('submit', searchMeal);

random.addEventListener('click', getRandomMeal);

category.addEventListener('click', listCategory);

mealsEl.addEventListener('click', (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }
  });
  // console.log(mealInfo);

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    // console.log(mealID);
    getMealById(mealID);
  }
});

meal_categoryEl.addEventListener('click', (e) => {
  const meals = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains('cat-info');
    } else {
      return false;
    }
  });
  console.log(meals);

  if (meals) {
    const categoryName = meals.getAttribute('data-category-name');
    console.log(categoryName);
    // getMealsByCategory(categoryName);
  }
});
