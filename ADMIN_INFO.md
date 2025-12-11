# Admin Panel Information

## Admin Credentials

**Password:** `tastia2024admin`

To access the admin panel:
1. Navigate to `/admin` in your browser
2. Enter the password: `tastia2024admin`
3. You'll have access to:
   - Dashboard (`/admin`)
   - Categories Management (`/admin/categories`)
   - Items Management (`/admin/items`)

## Troubleshooting Menu Not Showing Items

If you don't see items in the menu page, try:

1. **Clear browser cache:**
   - Open browser DevTools (F12)
   - Go to Application/Storage tab
   - Clear Local Storage
   - Refresh the page

2. **Check API endpoints:**
   - Visit `http://localhost:3000/api/categories` - should return categories
   - Visit `http://localhost:3000/api/items` - should return menu items

3. **Verify data in database:**
   - Check admin panel at `/admin/categories` and `/admin/items`
   - Ensure items have `status: 'active'`
   - Ensure items have valid `categoryId` matching a category

4. **Check browser console:**
   - Open DevTools (F12)
   - Check Console tab for any errors
   - Check Network tab to see if API calls are successful

## Seed Scripts

- **Seed Categories:** `node scripts/seed-db.js`
- **Seed Menu Items:** `node scripts/seed-items.js`
- **Force Reseed:** Add `--force` flag to either script









