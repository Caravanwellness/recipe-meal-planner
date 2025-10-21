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
    const { id } = req.query;

    if (id !== undefined) {
      // GET /api/recipes?id=0
      const recipe = allRecipes.find(r => r.id == id);
      if (!recipe) {
        return res.status(404).json({ success: false, error: 'Recipe not found' });
      }
      return res.status(200).json({ success: true, data: recipe });
    }

    // GET /api/recipes
    res.status(200).json({
      success: true,
      data: allRecipes,
      count: allRecipes.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
