const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
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

    // PRODUCT API with Pagination
    app.get("/products", async (req, res) => {
      const search = req.query.productName || "";
      const sort = req.query.sort || ""; // Sorting order (low-to-high or high-to-low)
      // const page = parseInt(req.query.page) || 1; // Current page number (default 1)
      // const limit = parseInt(req.query.limit) || 10; // Items per page (default 10)

      // Build the query
      let query = {};
      if (search) {
        query = { productName: { $regex: search, $options: "i" } };
      }

      // Build the sort query
      let sortQuery = {};
      if (sort === "low-to-high") {
        sortQuery = { price: 1 }; // Sort by price ascending
      } else if (sort === "high-to-low") {
        sortQuery = { price: -1 }; // Sort by price descending
      }

      // Calculate the total number of documents
      const totalProducts = await productCollection.countDocuments(query);

      // Calculate the number of documents to skip
      // const skip = (page - 1) * limit;

      // Fetch the products with pagination and sorting
      const products = await productCollection
        .find(query)
        .sort(sortQuery)
        // .skip(skip)
        // .limit(limit)
        .toArray();

      // Return the response with pagination info
      res.send({
        success: true,
        data: products,
      });
    });

    // await client.connect();
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Keep the connection open
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to Sadhin Mart Server Running");
});

app.listen(port, () => {
  console.log(`Sadhin Mart Server Listening on port ${port}`);
});
