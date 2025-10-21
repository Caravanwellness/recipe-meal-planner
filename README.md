# Recipe Meal Planner with API

Your interactive meal planner now has a **REST API** for app integration! No database required.

## What's New

Your meal planner can now be accessed via API endpoints, making it perfect for integration with mobile apps, web applications, and other services.

### Files Created

| File | Purpose |
|------|---------|
| `api/app.js` | **Delivers complete HTML app** 🎯 |
| `api/recipes.js` | Serverless function for recipes |
| `api/search.js` | Serverless function for search |
| `api/meal-plans.js` | Serverless function for meal plans |
| `recipes.json` | Recipe data extracted from your HTML |
| `package.json` | Node.js dependencies |
| `vercel.json` | Vercel configuration |
| `API_APP_DELIVERY.md` | **How to deliver app via API** 🚀 |
| `API_GUIDE.md` | Complete API documentation |
| `VERCEL_DEPLOYMENT.md` | **Deploy to Vercel (free)** ✨ |

## 🚀 API Delivers Complete Interactive Application

Your meal planner is now **delivered entirely via API**!

### Two Ways to Access:
1. **Direct URL:** `https://your-app.vercel.app/` (HTML static file)
2. **API Endpoint:** `https://your-app.vercel.app/api/app` (API returns complete HTML)

### What You Get:
✅ Full interactive meal planner served via API
✅ Self-contained application (no dependencies)
✅ Embeddable in websites, mobile apps, desktop apps
✅ One endpoint delivers everything (HTML, CSS, JavaScript, recipes)

👉 **See `API_APP_DELIVERY.md` for complete integration guide**

## 🚀 Deploy on Vercel (FREE!)

Share your meal planner with the world in 3 minutes:

👉 **See `VERCEL_DEPLOYMENT.md` for step-by-step instructions**

Your deployment gets:
- ✅ Full interactive meal planner
- ✅ API endpoint for app delivery
- ✅ Serverless backend (auto-scaling)
- ✅ Global CDN
- ✅ Free forever (on free tier)
- ✅ Custom domain support

**Direct URL:** `https://your-app.vercel.app/`
**API Endpoint:** `https://your-app.vercel.app/api/app`

## Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

Server runs at: `http://localhost:3000`

### 3. Try It Out
```bash
# Get all recipes
curl http://localhost:3000/api/recipes

# Create a meal plan
curl -X POST http://localhost:3000/api/meal-plans \
  -H "Content-Type: application/json" \
  -d '{"name":"My Plan"}'
```

## API Endpoints Overview

### Recipes
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/{id}` - Get single recipe
- `GET /api/recipes/search?q=keyword` - Search recipes

### Meal Plans
- `POST /api/meal-plans` - Create meal plan
- `GET /api/meal-plans` - List all plans
- `GET /api/meal-plans/{id}` - Get plan details
- `POST /api/meal-plans/{id}/meals` - Add recipe to plan
- `PUT /api/meal-plans/{id}/meals/{type}/{index}` - Update serving size
- `DELETE /api/meal-plans/{id}/meals/{type}/{index}` - Remove recipe
- `DELETE /api/meal-plans/{id}` - Delete entire plan

### Grocery Lists
- `GET /api/meal-plans/{id}/grocery-list` - Get aggregated ingredients

## Features

✅ **No Database** - Uses your HTML data directly
✅ **10 Pre-loaded Recipes** - All your existing recipes
✅ **Full CRUD Operations** - Create, read, update, delete meal plans
✅ **Smart Search** - Search by title, ingredients, dietary restrictions
✅ **Grocery List Generation** - Automatic ingredient aggregation
✅ **CORS Enabled** - Works with any frontend
✅ **Low Overhead** - Lightweight Express server

## Your Original App

The interactive meal planner still works as before:
- Visit `http://localhost:3000/` in your browser
- All original functionality preserved
- Search, filter, drag-and-drop, grocery list generation

## Data Structure

### Recipe Object
```json
{
  "id": 0,
  "title": "Chickpea, Sweet Potato & Rice Bake",
  "section": "Lunch, Dinner",
  "meal_type": "Multi-Serving Meal Prep",
  "dietary_restrictions": "Post-Surgery, Limited Ingredient, Easy to Digest...",
  "servings": "6",
  "prep_time": "10 min",
  "cook_time": "30 min",
  "ingredients": [...],
  "steps": [...],
  "nutrition": {...},
  "storage": "...",
  "reheat": "..."
}
```

### Meal Plan Object
```json
{
  "id": "plan-1",
  "name": "My Meal Plan",
  "createdAt": "2025-10-21T05:20:41.428Z",
  "meals": {
    "Breakfast": [],
    "Lunch": [],
    "Dinner": []
  }
}
```

## Complete Workflow Example

```javascript
// 1. Create a meal plan
const planRes = await fetch('http://localhost:3000/api/meal-plans', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Monday' })
});
const { data: plan } = await planRes.json();

// 2. Search for breakfast recipes
const searchRes = await fetch(
  'http://localhost:3000/api/recipes/search?q=breakfast&meal_type=Breakfast'
);
const { data: recipes } = await searchRes.json();

// 3. Add recipe to breakfast
await fetch(`http://localhost:3000/api/meal-plans/${plan.id}/meals`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recipeId: recipes[0].id,
    mealType: 'Breakfast',
    servingMultiplier: 2
  })
});

// 4. Get grocery list
const groceryRes = await fetch(
  `http://localhost:3000/api/meal-plans/${plan.id}/grocery-list`
);
const { data: groceries } = await groceryRes.json();
```

## Integration Examples

### React
```javascript
import { useState, useEffect } from 'react';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/recipes')
      .then(res => res.json())
      .then(data => setRecipes(data.data));
  }, []);

  return recipes.map(recipe => (
    <div key={recipe.id}>
      <h3>{recipe.title}</h3>
      <p>{recipe.estimated_time}</p>
    </div>
  ));
}
```

### React Native
```javascript
const response = await fetch('http://localhost:3000/api/recipes');
const { data: recipes } = await response.json();
```

### Flutter/Dart
```dart
final response = await http.get(Uri.parse('http://localhost:3000/api/recipes'));
final recipes = jsonDecode(response.body)['data'];
```

## Architecture

```
Your HTML File
     ↓
recipes.json (extracted data)
     ↓
Express Server (server.js)
     ↓
REST API Endpoints
     ↓
Mobile Apps / Web Apps / Services
```

## Data Persistence

**Current Implementation:**
- Meal plans stored in memory during server session
- Data persists as long as server is running
- Lost when server restarts

**To Add Persistence:**
- Add SQLite for file-based storage
- Add MongoDB for cloud storage
- Add PostgreSQL for robust database
- See `API_GUIDE.md` for future enhancement ideas

## Configuration

### Port
```bash
PORT=5000 npm start
```

### CORS
Already enabled for all origins. To restrict:
```javascript
// In server.js
app.use(cors({
  origin: 'https://yourapp.com'
}));
```

## Deployment

### Local
```bash
npm start
```

### Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
```

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### AWS Lambda / Serverless
Consider using Serverless Framework for event-driven deployments

## Documentation

- **`API_GUIDE.md`** - Complete endpoint reference
- **`QUICKSTART.md`** - Quick setup guide
- **`server.js`** - Inline code comments

## Error Handling

All endpoints return JSON with `success` field:

```json
{
  "success": true,
  "data": {...}
}
```

or

```json
{
  "success": false,
  "error": "Error message"
}
```

## Rate Limiting

Not implemented. For production, consider adding:
- `express-rate-limit` package
- Set reasonable limits per IP
- Add authentication tokens

## Security Notes

For production use:
- Add authentication/authorization
- Validate all inputs
- Add rate limiting
- Use HTTPS
- Add request logging
- Implement CORS restrictions
- Add API versioning

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=5000 npm start
```

### CORS Errors
Ensure API is running and accessible:
```bash
curl http://localhost:3000/api/health
```

### Recipes Not Loading
Check that `recipes.json` exists and is valid:
```bash
npm start 2>&1 | grep -i error
```

## Support

For issues or questions:
1. Check `API_GUIDE.md` for endpoint details
2. Review error messages in server console
3. Verify recipe data in `recipes.json`

## Future Enhancements

- Add user authentication
- Add database persistence
- Add meal plan templates
- Add nutritional analysis
- Add recipe ratings/reviews
- Add shopping list sharing
- Add dietary preference filtering
- Add multiple language support

---

**Status:** ✅ Ready for app integration
**Method:** Low-effort (no database)
**Recipes:** 10 pre-loaded
**Endpoints:** 14 API routes
