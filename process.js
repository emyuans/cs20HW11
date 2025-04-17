const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();


const uri = "mongodb+srv://emilyyuan:Pickmeup123%24@webprogamming.emwd9cb.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

app.use(express.static('public'));

app.get('/process', async (req, res) => {
  try {
    const query = req.query.query;
    const type = req.query.type;

    await client.connect();
    const db = client.db("Stock");
    const collection = db.collection("PublicCompanies");

    let searchQuery = {};
    if (type === "company") {
      searchQuery = { company: query };
    } else if (type === "ticker") {
      searchQuery = { ticker: query };
    } 

    const results = await collection.find(searchQuery).toArray();

    console.log("🔍 Query:", searchQuery);
    console.log("🧾 Results:", results);

    // Display results on the page (extra credit!)
    if (results.length === 0) {
      res.send("<h2>No matches found.</h2>");
    } else {
      let html = `<h2>Results for "${query}":</h2><ul>`;
      results.forEach(item => {
        html += `<li>${item.company} (${item.ticker}) – $${item.price}</li>`;
      });
      html += "</ul>";
      res.send(html);
    }

  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("Server error.");
  } finally {
    await client.close();
  }
});

// 🔌 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});
