const express = require("express")
const mongoose = require("mongoose")
const server = express();

const port = 3003;
server.use(express.json());

//create product schema
const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
})

//create product model
const Product = mongoose.model("Products", productsSchema);

//connection with database  
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017");
        console.log("db is connected!");
    }
    catch (error) {
        console.log("db is not connected!");
        console.log(error?.messsage);
        process.exit(1);
    }
}

server.listen(port, async () => {
    console.log(`server is runnig at http://localhost:${port}`);
    await connectDB();
})

server.get("/", (req, res) => {
    res.send("Welcome to our server!");
})


server.post("/product", async (req, res) => {
    try {
        const title = req.body.title;
        const price = req.body.price;
        const description = req.body.description;
        const newProduct = new Product({
            title,
            price,
            description,
        });
        const productData = await newProduct.save();
        /* const productData = await newProduct.insertMany([
            {
                title: "iphone 5",
                price: 250,
                description: "beautiful phone"
            },
            {
                title: "iphone 5",
                price: 250,
                description: "dirty phone"
            }
         ]);*/
        res.status(201).send(productData)
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})


server.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        if (products) {
            res.status(200).send(products);
        } else {
            res.status(404).send({
                message: "products not found",
            })
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

server.get("/products/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({ _id: id }).select({ title: 1 });
        if (product) {
            res.status(200).send({
                success: true,
                message: "return single product",
                data: product,
            });
        } else {
            res.status(404).send({
                success: false,
                message: "product not found",
            })
        }

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

// For no-sql database Database structure are Database -> Collection -> Documents
// GET: /products -> return all the products
// GET: /products/:id -> return a specific product
// POST: /products -> create a product
//PUT: /products/:id -> Update a product based on id
//DELETE: /products/:id -> delete a product based on id
