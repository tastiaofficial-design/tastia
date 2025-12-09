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
    color: { type: String, default: '#B94A24' },
    icon: String,
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    featuredOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

// Initial Tastia categories
const initialCategories = [
    { name: 'السلطات', nameEn: 'Salads', color: '#B94A24', order: 1, status: 'active' },
    { name: 'الشوربات', nameEn: 'Soups', color: '#B94A24', order: 2, status: 'active' },
    { name: 'المقبلات', nameEn: 'Appetizers', color: '#B94A24', order: 3, status: 'active' },
    { name: 'أطباق رئيسية دجاج', nameEn: 'Chicken Main Dishes', color: '#B94A24', order: 4, status: 'active' },
    { name: 'الباستا', nameEn: 'Pasta', color: '#B94A24', order: 5, status: 'active' },
    { name: 'أطباق رئيسية لحم', nameEn: 'Meat Main Dishes', color: '#B94A24', order: 6, status: 'active' },
    { name: 'أطباق رئيسية أسماك', nameEn: 'Fish Main Dishes', color: '#B94A24', order: 7, status: 'active' },
    { name: 'الحلى', nameEn: 'Desserts', color: '#B94A24', order: 8, status: 'active' },
    { name: 'مشروبات غازية', nameEn: 'Soft Drinks', color: '#B94A24', order: 9, status: 'active' },
    { name: 'مياة', nameEn: 'Water', color: '#B94A24', order: 10, status: 'active' },
];

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if categories already exist
        const existingCount = await Category.countDocuments();
        console.log(`Existing categories: ${existingCount}`);

        if (existingCount > 0) {
            const force = process.argv.includes('--force');
            if (!force) {
                console.log('Categories already exist. Use --force to reseed.');
                console.log('Existing categories:');
                const existing = await Category.find().sort({ order: 1 });
                existing.forEach(cat => {
                    console.log(`  - ${cat.name} (${cat.nameEn || 'N/A'})`);
                });
                process.exit(0);
            } else {
                console.log('Force flag detected. Deleting existing categories...');
                await Category.deleteMany({});
                console.log('Deleted existing categories');
            }
        }

        // Insert all categories
        console.log('Inserting categories...');
        const categories = await Category.insertMany(initialCategories);
        console.log(`\n✅ Successfully seeded ${categories.length} categories:`);
        
        categories.forEach(cat => {
            console.log(`  ✓ ${cat.name} (${cat.nameEn || 'N/A'})`);
        });

        console.log('\n✅ Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seedDatabase();




