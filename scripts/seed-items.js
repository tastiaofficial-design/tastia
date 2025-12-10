const mongoose = require('mongoose');

// MongoDB URI
const MONGODB_URI = process.env.TASTIA_MONGODB_URI || 
                    process.env.MONGODB_URI || 
                    'mongodb+srv://eslamabdaltif:oneone2@cluster0.0xmhgyz.mongodb.net/tastia?retryWrites=true&w=majority&appName=Cluster0';

// Category Schema
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    nameEn: String,
    description: String,
    image: String,
    color: String,
    icon: String,
    order: Number,
    featured: Boolean,
    featuredOrder: Number,
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

// MenuItem Schema
const MenuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    nameEn: String,
    description: String,
    descriptionEn: String,
    categoryId: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: Number,
    image: String,
    images: [String],
    color: String,
    ingredients: [{
        ingredientId: String,
        portion: Number,
        required: Boolean,
    }],
    preparationTime: Number,
    calories: Number,
    servingSize: String,
    tags: [String],
    allergens: [String],
    status: { type: String, enum: ['active', 'inactive', 'out_of_stock'], default: 'active' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);

// Menu items organized by category
const menuItemsByCategory = {
    'السلطات': [ // Salads
        {
            name: 'سلطة سيزر',
            nameEn: 'Caesar Salad',
            description: 'سلطة طازجة مع صوص سيزر الكلاسيكي وجبن البارميزان',
            descriptionEn: 'Fresh salad with classic Caesar dressing and parmesan cheese',
            price: 25,
            calories: 320,
            preparationTime: 10,
            status: 'active',
            order: 1,
        },
        {
            name: 'سلطة يونانية',
            nameEn: 'Greek Salad',
            description: 'سلطة يونانية تقليدية مع الجبن الفيتا والزيتون',
            descriptionEn: 'Traditional Greek salad with feta cheese and olives',
            price: 28,
            calories: 280,
            preparationTime: 12,
            status: 'active',
            order: 2,
        },
        {
            name: 'سلطة خضار مشكلة',
            nameEn: 'Mixed Vegetable Salad',
            description: 'خليط من الخضار الطازجة مع صوص خاص',
            descriptionEn: 'Mix of fresh vegetables with special dressing',
            price: 22,
            calories: 150,
            preparationTime: 8,
            status: 'active',
            order: 3,
        },
    ],
    'الشوربات': [ // Soups
        {
            name: 'شوربة العدس',
            nameEn: 'Lentil Soup',
            description: 'شوربة العدس التقليدية الساخنة',
            descriptionEn: 'Traditional hot lentil soup',
            price: 18,
            calories: 180,
            preparationTime: 15,
            status: 'active',
            order: 1,
        },
        {
            name: 'شوربة الدجاج',
            nameEn: 'Chicken Soup',
            description: 'شوربة دجاج دافئة ومغذية',
            descriptionEn: 'Warm and nutritious chicken soup',
            price: 20,
            calories: 200,
            preparationTime: 20,
            status: 'active',
            order: 2,
        },
    ],
    'المقبلات': [ // Appetizers
        {
            name: 'حمص',
            nameEn: 'Hummus',
            description: 'حمص كريمي مع زيت الزيتون',
            descriptionEn: 'Creamy hummus with olive oil',
            price: 15,
            calories: 250,
            preparationTime: 5,
            status: 'active',
            order: 1,
        },
        {
            name: 'فلافل',
            nameEn: 'Falafel',
            description: 'فلافل مقرمش مع طحينة',
            descriptionEn: 'Crispy falafel with tahini',
            price: 18,
            calories: 300,
            preparationTime: 10,
            status: 'active',
            order: 2,
        },
        {
            name: 'متبل',
            nameEn: 'Mutabal',
            description: 'متبل الباذنجان المشوي',
            descriptionEn: 'Roasted eggplant mutabal',
            price: 16,
            calories: 180,
            preparationTime: 8,
            status: 'active',
            order: 3,
        },
    ],
    'أطباق رئيسية دجاج': [ // Chicken Main Dishes
        {
            name: 'دجاج مشوي',
            nameEn: 'Grilled Chicken',
            description: 'دجاج مشوي طازج مع أرز وخضار',
            descriptionEn: 'Fresh grilled chicken with rice and vegetables',
            price: 45,
            calories: 450,
            preparationTime: 25,
            status: 'active',
            order: 1,
        },
        {
            name: 'شاورما دجاج',
            nameEn: 'Chicken Shawarma',
            description: 'شاورما دجاج مع خبز وثومية',
            descriptionEn: 'Chicken shawarma with bread and garlic sauce',
            price: 35,
            calories: 380,
            preparationTime: 15,
            status: 'active',
            order: 2,
        },
    ],
    'الباستا': [ // Pasta
        {
            name: 'باستا كاربونارا',
            nameEn: 'Carbonara Pasta',
            description: 'باستا كاربونارا إيطالية مع لحم مقدد',
            descriptionEn: 'Italian carbonara pasta with bacon',
            price: 42,
            calories: 520,
            preparationTime: 20,
            status: 'active',
            order: 1,
        },
        {
            name: 'باستا بولونيز',
            nameEn: 'Bolognese Pasta',
            description: 'باستا مع صلصة البولونيز',
            descriptionEn: 'Pasta with bolognese sauce',
            price: 40,
            calories: 480,
            preparationTime: 18,
            status: 'active',
            order: 2,
        },
    ],
    'أطباق رئيسية لحم': [ // Meat Main Dishes
        {
            name: 'لحم مشوي',
            nameEn: 'Grilled Beef',
            description: 'لحم مشوي طازج مع بطاطس وخضار',
            descriptionEn: 'Fresh grilled beef with potatoes and vegetables',
            price: 65,
            calories: 550,
            preparationTime: 30,
            status: 'active',
            order: 1,
        },
        {
            name: 'كبة',
            nameEn: 'Kibbeh',
            description: 'كبة لبنانية تقليدية',
            descriptionEn: 'Traditional Lebanese kibbeh',
            price: 38,
            calories: 420,
            preparationTime: 25,
            status: 'active',
            order: 2,
        },
        {
            name: 'كباب',
            nameEn: 'Kebab',
            description: 'كباب مشوي مع أرز وطماطم',
            descriptionEn: 'Grilled kebab with rice and tomatoes',
            price: 48,
            calories: 500,
            preparationTime: 20,
            status: 'active',
            order: 3,
        },
    ],
    'أطباق رئيسية أسماك': [ // Fish Main Dishes
        {
            name: 'سمك مشوي',
            nameEn: 'Grilled Fish',
            description: 'سمك طازج مشوي مع أرز وخضار',
            descriptionEn: 'Fresh grilled fish with rice and vegetables',
            price: 55,
            calories: 380,
            preparationTime: 25,
            status: 'active',
            order: 1,
        },
        {
            name: 'سمك مقلي',
            nameEn: 'Fried Fish',
            description: 'سمك مقلي مقرمش مع بطاطس',
            descriptionEn: 'Crispy fried fish with potatoes',
            price: 50,
            calories: 450,
            preparationTime: 20,
            status: 'active',
            order: 2,
        },
    ],
    'الحلى': [ // Desserts
        {
            name: 'بقلاوة',
            nameEn: 'Baklava',
            description: 'بقلاوة عسل مع فستق',
            descriptionEn: 'Honey baklava with pistachios',
            price: 25,
            calories: 350,
            preparationTime: 5,
            status: 'active',
            order: 1,
        },
        {
            name: 'كنافة',
            nameEn: 'Kunafa',
            description: 'كنافة نابلسية مع قشطة',
            descriptionEn: 'Nabulsi kunafa with cream',
            price: 28,
            calories: 420,
            preparationTime: 8,
            status: 'active',
            order: 2,
        },
        {
            name: 'آيس كريم',
            nameEn: 'Ice Cream',
            description: 'آيس كريم بثلاث نكهات',
            descriptionEn: 'Ice cream with three flavors',
            price: 20,
            calories: 280,
            preparationTime: 3,
            status: 'active',
            order: 3,
        },
    ],
    'مشروبات غازية': [ // Soft Drinks
        {
            name: 'كولا',
            nameEn: 'Cola',
            description: 'مشروب غازي كولا',
            descriptionEn: 'Cola soft drink',
            price: 8,
            calories: 140,
            preparationTime: 1,
            status: 'active',
            order: 1,
        },
        {
            name: 'سبرايت',
            nameEn: 'Sprite',
            description: 'مشروب غازي سبرايت',
            descriptionEn: 'Sprite soft drink',
            price: 8,
            calories: 130,
            preparationTime: 1,
            status: 'active',
            order: 2,
        },
        {
            name: 'عصير برتقال',
            nameEn: 'Orange Juice',
            description: 'عصير برتقال طبيعي',
            descriptionEn: 'Natural orange juice',
            price: 12,
            calories: 110,
            preparationTime: 3,
            status: 'active',
            order: 3,
        },
    ],
    'مياة': [ // Water
        {
            name: 'مياه معدنية',
            nameEn: 'Mineral Water',
            description: 'مياه معدنية طبيعية',
            descriptionEn: 'Natural mineral water',
            price: 5,
            calories: 0,
            preparationTime: 1,
            status: 'active',
            order: 1,
        },
        {
            name: 'مياه غازية',
            nameEn: 'Sparkling Water',
            description: 'مياه معدنية غازية',
            descriptionEn: 'Sparkling mineral water',
            price: 6,
            calories: 0,
            preparationTime: 1,
            status: 'active',
            order: 2,
        },
    ],
};

async function seedMenuItems() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB\n');

        // Get all categories
        const categories = await Category.find({ status: 'active' }).sort({ order: 1 });
        console.log(`Found ${categories.length} categories\n`);

        if (categories.length === 0) {
            console.log('❌ No categories found. Please run the category seed script first.');
            process.exit(1);
        }

        // Check if items already exist
        const existingCount = await MenuItem.countDocuments();
        const force = process.argv.includes('--force');

        if (existingCount > 0 && !force) {
            console.log(`⚠️  ${existingCount} menu items already exist. Use --force to reseed.`);
            process.exit(0);
        }

        if (force && existingCount > 0) {
            console.log('🗑️  Force flag detected. Deleting existing menu items...');
            await MenuItem.deleteMany({});
            console.log('✅ Deleted existing menu items\n');
        }

        let totalItems = 0;
        const itemsByCategory = {};

        // Seed items for each category
        for (const category of categories) {
            const categoryItems = menuItemsByCategory[category.name];
            
            if (!categoryItems || categoryItems.length === 0) {
                console.log(`⚠️  No items defined for category: ${category.name}`);
                continue;
            }

            const itemsToInsert = categoryItems.map(item => ({
                ...item,
                categoryId: category._id.toString(),
                color: category.color || '#B94A24',
            }));

            const insertedItems = await MenuItem.insertMany(itemsToInsert);
            totalItems += insertedItems.length;
            itemsByCategory[category.name] = insertedItems.length;

            console.log(`✅ Added ${insertedItems.length} items to "${category.name}":`);
            insertedItems.forEach(item => {
                console.log(`   • ${item.name} (${item.nameEn || 'N/A'}) - ${item.price} ر.س`);
            });
            console.log('');
        }

        console.log('═══════════════════════════════════════');
        console.log(`✅ Successfully seeded ${totalItems} menu items across ${Object.keys(itemsByCategory).length} categories!`);
        console.log('═══════════════════════════════════════\n');

        // Summary
        console.log('Summary by category:');
        Object.entries(itemsByCategory).forEach(([category, count]) => {
            console.log(`  ${category}: ${count} items`);
        });

        console.log('\n✅ Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

seedMenuItems();









