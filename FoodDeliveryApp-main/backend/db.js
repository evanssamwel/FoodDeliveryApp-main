const mongoose = require('mongoose')
const mongoURI = process.env.MONGO_URI || 'mongodb://<!#@!#@>:"!@!@"@merncluster-shard-00-00.d1d4z.mongodb.net:27017,merncluster-shard-00-01.d1d4z.mongodb.net:27017,merncluster-shard-00-02.d1d4z.mongodb.net:27017/Customer?ssl=true&replicaSet=atlas-eusy5p-shard-0&authSource=admin&retryWrites=true&w=majority'

const defaultCategories = [
    { _id: "cat1", CategoryName: "Biryani/Rice" },
    { _id: "cat2", CategoryName: "Starter" },
    { _id: "cat3", CategoryName: "Pizza" }
];

const defaultFoodItems = [
    {
        _id: "62ff20fbaed6a15f800125e9",
        CategoryName: "Biryani/Rice",
        name: "Chicken Fried Rice",
        img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        options: [{ half: "130", full: "220" }],
        description: "Made using Indian masalas and Basmati rice."
    },
    {
        _id: "62ff20fbaed6a15f800125ea",
        CategoryName: "Biryani/Rice",
        name: "Veg Fried Rice",
        img: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        options: [{ half: "110", full: "200" }],
        description: "Fresh vegetables tossed with aromatic Basmati rice."
    },
    {
        _id: "62ff20fbaed6a15f800125eb",
        CategoryName: "Biryani/Rice",
        name: "Hyderabadi Chicken Biryani",
        img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        options: [{ half: "170", full: "300" }],
        description: "Authentic slow-cooked dum biryani with tender chicken."
    },
    {
        _id: "62ff20fbaed6a15f800125ec",
        CategoryName: "Starter",
        name: "Chilli Paneer",
        img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        options: [{ half: "120", full: "200" }],
        description: "Crispy paneer cubes tossed in spicy Indo-Chinese sauce."
    },
    {
        _id: "62ff20fbaed6a15f800125ed",
        CategoryName: "Starter",
        name: "Chicken Tikka",
        img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        options: [{ half: "150", full: "260" }],
        description: "Char-grilled boneless chicken marinated in yogurt and spices."
    },
    {
        _id: "62ff20fbaed6a15f800125f3",
        CategoryName: "Pizza",
        name: "Chicken Double Cheese Pizza",
        img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        options: [{ regular: "120", medium: "230", large: "350" }],
        description: "Loaded with double mozzarella cheese and roasted chicken."
    },
    {
        _id: "62ff20fbaed6a15f800125f4",
        CategoryName: "Pizza",
        name: "Mix Veg Pizza",
        img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        options: [{ regular: "100", medium: "200", large: "300" }],
        description: "Classic wood-fired style pizza topped with bell peppers, olives, and corn."
    }
];

module.exports = function (callback) {
    if (mongoURI.includes('<!#@!#@>')) {
        console.log("Using built-in sample food data (no MongoDB URI configured).")
        global.useInMemoryDB = true;
        return callback(null, defaultFoodItems, defaultCategories);
    }
    mongoose.connect(mongoURI, { useNewUrlParser: true }, async (err, result) => {
        if (err) {
            console.log("--- MongoDB connection failed, falling back to sample data: " + err)
            global.useInMemoryDB = true;
            callback(null, defaultFoodItems, defaultCategories);
        } else {
            console.log("connected to mongo")
            const foodCollection = await mongoose.connection.db.collection("food_items");
            foodCollection.find({}).toArray(async function (err, data) {
                const categoryCollection = await mongoose.connection.db.collection("Categories");
                categoryCollection.find({}).toArray(async function (err, Catdata) {
                    callback(err, data, Catdata);
                })
            });
        }
    })
};
