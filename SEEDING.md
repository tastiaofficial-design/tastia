# Database Seeding Guide

## Seed Categories

To seed the database with initial categories, you have two options:

### Option 1: Using the API Endpoint (Recommended)

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Make a POST request to the seed endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```

   Or use a tool like Postman, or visit the endpoint in your browser after starting the server.

3. If categories already exist and you want to reseed, use the force parameter:
   ```bash
   curl -X POST "http://localhost:3000/api/seed?force=true"
   ```

### Option 2: Check Seed Status

To check if categories have been seeded:

```bash
curl http://localhost:3000/api/seed
```

## Categories Included

The seed will add the following 10 categories:

1. السلطات (Salads)
2. الشوربات (Soups)
3. المقبلات (Appetizers)
4. أطباق رئيسية دجاج (Chicken Main Dishes)
5. الباستا (Pasta)
6. أطباق رئيسية لحم (Meat Main Dishes)
7. أطباق رئيسية أسماك (Fish Main Dishes)
8. الحلى (Desserts)
9. مشروبات غازية (Soft Drinks)
10. مياة (Water)

All categories will be set to `active` status and use the Tastia primary color (#B94A24).




