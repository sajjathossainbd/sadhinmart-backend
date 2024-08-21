const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8i4eibr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const productCollection = client.db("sadhinmart").collection("products");

    // PRODUCT API
    app.get("/products", async (req, res) => {
      const search = req.query.productName;
      const sort = req.query.sort; // Retrieve the sort query parameter
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      let query = {};
      let sortQuery = {};

      if (search) {
        query = { productName: { $regex: search, $options: "i" } };
      }

      if (sort === "low-to-high") {
        sortQuery = { price: 1 }; // Sort by price ascending
      } else if (sort === "high-to-low") {
        sortQuery = { price: -1 }; // Sort by price descending
      }

      const skip = page - 1;
      const totalPages = Math.ceil(totalItems / limit);

      const products = await productCollection
        .find(query)
        .sort(sortQuery)
        .toArray()
        .skip(skip)
        .limit(limit);

      res.send({
        success: true,
        data: products,
        pagination: {
          totalProducts,
          totalPages: Math.ceil(totalProducts / limit),
          currentPage: page,
          limit,
        },
      });
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Keep the connection open
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to Sadhin Mart Server Is Running");
});

app.listen(port, () => {
  console.log(`Sadhin Mart Server Listening on port ${port}`);
});
