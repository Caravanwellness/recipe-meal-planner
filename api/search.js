import fs from 'fs';
import path from 'path';

let recipes = null;

function loadRecipes() {
  if (!recipes) {
    const recipePath = path.join(process.cwd(), 'recipes.json');
    const data = fs.readFileSync(recipePath, 'utf8');
    recipes = JSON.parse(data);
  }
  return recipes;
}

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const allRecipes = loadRecipes();
    const { q, meal_type } = req.query;

    let filtered = allRecipes;

    if (q) {
      const searchTerm = q.toLowerCase();
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.dietary_restrictions.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some(ing =>
          ing.name.toLowerCase().includes(searchTerm)
        )
      );
    }

    if (meal_type) {
      filtered = filtered.filter(recipe => recipe.section.includes(meal_type));
    }

    res.status(200).json({
      success: true,
      data: filtered,
      count: filtered.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
