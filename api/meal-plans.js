import fs from 'fs';
import path from 'path';

let recipes = null;
let mealPlans = new Map();
let mealPlanIdCounter = 1;

function loadRecipes() {
  if (!recipes) {
    const recipePath = path.join(process.cwd(), 'recipes.json');
    const data = fs.readFileSync(recipePath, 'utf8');
    recipes = JSON.parse(data);
  }
  return recipes;
}

function corsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
}

export default function handler(req, res) {
  corsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const allRecipes = loadRecipes();
    const { id, action } = req.query;

    // POST /api/meal-plans - Create new meal plan
    if (req.method === 'POST' && !id) {
      const { name } = req.body || {};
      const planId = `plan-${mealPlanIdCounter++}`;

      const newPlan = {
        id: planId,
        name: name || `Meal Plan ${planId}`,
        createdAt: new Date().toISOString(),
        meals: {
          Breakfast: [],
          Lunch: [],
          Dinner: []
        }
      };

      mealPlans.set(planId, newPlan);
      return res.status(201).json({ success: true, data: newPlan });
    }

    // GET /api/meal-plans - List all meal plans
    if (req.method === 'GET' && !id) {
      const plans = Array.from(mealPlans.values());
      return res.status(200).json({
        success: true,
        data: plans,
        count: plans.length
      });
    }

    // With ID operations
    if (!id) {
      return res.status(400).json({ success: false, error: 'Plan ID required' });
    }

    // GET /api/meal-plans?id=plan-1 - Get specific meal plan
    if (req.method === 'GET') {
      const plan = mealPlans.get(id);
      if (!plan) {
        return res.status(404).json({ success: false, error: 'Meal plan not found' });
      }
      return res.status(200).json({ success: true, data: plan });
    }

    // DELETE /api/meal-plans?id=plan-1 - Delete meal plan
    if (req.method === 'DELETE' && !action) {
      if (!mealPlans.has(id)) {
        return res.status(404).json({ success: false, error: 'Meal plan not found' });
      }
      mealPlans.delete(id);
      return res.status(200).json({ success: true, data: { message: 'Meal plan deleted' } });
    }

    // POST /api/meal-plans?id=plan-1&action=add-meal - Add recipe to plan
    if (req.method === 'POST' && action === 'add-meal') {
      const { recipeId, mealType, servingMultiplier } = req.body || {};
      const plan = mealPlans.get(id);

      if (!plan) {
        return res.status(404).json({ success: false, error: 'Meal plan not found' });
      }

      const recipe = allRecipes.find(r => r.id == recipeId);
      if (!recipe) {
        return res.status(404).json({ success: false, error: 'Recipe not found' });
      }

      if (!['Breakfast', 'Lunch', 'Dinner'].includes(mealType)) {
        return res.status(400).json({ success: false, error: 'Invalid meal type' });
      }

      const multiplier = servingMultiplier || 1;
      const mealEntry = {
        recipeId: recipe.id,
        recipe: recipe,
        servingMultiplier: multiplier,
        addedAt: new Date().toISOString()
      };

      plan.meals[mealType].push(mealEntry);
      return res.status(201).json({ success: true, data: mealEntry });
    }

    // DELETE /api/meal-plans?id=plan-1&action=remove-meal - Remove recipe
    if (req.method === 'DELETE' && action === 'remove-meal') {
      const { mealType, index } = req.body || {};
      const plan = mealPlans.get(id);

      if (!plan) {
        return res.status(404).json({ success: false, error: 'Meal plan not found' });
      }

      if (!['Breakfast', 'Lunch', 'Dinner'].includes(mealType)) {
        return res.status(400).json({ success: false, error: 'Invalid meal type' });
      }

      const mealIndex = parseInt(index);
      if (mealIndex < 0 || mealIndex >= plan.meals[mealType].length) {
        return res.status(404).json({ success: false, error: 'Meal entry not found' });
      }

      const removed = plan.meals[mealType].splice(mealIndex, 1)[0];
      return res.status(200).json({ success: true, data: { message: 'Meal removed', removed } });
    }

    // PUT /api/meal-plans?id=plan-1&action=update-servings - Update servings
    if (req.method === 'PUT' && action === 'update-servings') {
      const { mealType, index, servingMultiplier } = req.body || {};
      const plan = mealPlans.get(id);

      if (!plan) {
        return res.status(404).json({ success: false, error: 'Meal plan not found' });
      }

      if (!['Breakfast', 'Lunch', 'Dinner'].includes(mealType)) {
        return res.status(400).json({ success: false, error: 'Invalid meal type' });
      }

      const mealIndex = parseInt(index);
      if (mealIndex < 0 || mealIndex >= plan.meals[mealType].length) {
        return res.status(404).json({ success: false, error: 'Meal entry not found' });
      }

      plan.meals[mealType][mealIndex].servingMultiplier = servingMultiplier || 1;
      plan.meals[mealType][mealIndex].updatedAt = new Date().toISOString();

      return res.status(200).json({ success: true, data: plan.meals[mealType][mealIndex] });
    }

    // GET /api/meal-plans?id=plan-1&action=grocery-list - Get grocery list
    if (req.method === 'GET' && action === 'grocery-list') {
      const plan = mealPlans.get(id);
      if (!plan) {
        return res.status(404).json({ success: false, error: 'Meal plan not found' });
      }

      const groceryList = {};

      Object.keys(plan.meals).forEach(mealType => {
        plan.meals[mealType].forEach(meal => {
          meal.recipe.ingredients.forEach(ingredient => {
            if (!groceryList[ingredient.name]) {
              groceryList[ingredient.name] = {
                name: ingredient.name,
                quantity: ingredient.quantity,
                count: 1
              };
            } else {
              groceryList[ingredient.name].count += 1;
            }
          });
        });
      });

      const groceryArray = Object.values(groceryList);
      return res.status(200).json({
        success: true,
        data: groceryArray,
        count: groceryArray.length
      });
    }

    res.status(400).json({ success: false, error: 'Invalid request' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}
