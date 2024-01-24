const express = require("express");
const path = require("path");
const csvtojson = require("csvtojson");
const { spawn } = require("child_process");

const app = express();

app.use(express.static(path.join(__dirname, "../dist")));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.post("/trx", async (req, res) => {
  try {
    const jsonData = await csvtojson().fromFile(
      "src/assets/db/final_transactions.csv"
    );

    let { purchase_date, customer_id, limit, selected_batch } = req.body;

    if (purchase_date && !/^\d{4}-(0[1-9]|1[0-2])$/.test(purchase_date)) {
      return res.status(400).json({ error: "Invalid purchase_date format" });
    }

    customer_id = customer_id ? String(customer_id) : null;

    limit = limit ? parseInt(limit, 10) : 5;
    selected_batch = selected_batch ? parseInt(selected_batch, 10) : 1;

    const filteredData = jsonData.filter((item) => {
      return (
        (!purchase_date || item.purchase_date.startsWith(purchase_date)) &&
        (!customer_id || item.customer_id === customer_id)
      );
    });

    const sortedData = filteredData.sort((a, b) => {
      return new Date(b.purchase_date) - new Date(a.purchase_date);
    });

    const groupedData = [];
    for (let i = 0; i < sortedData.length; i += limit) {
      groupedData.push(sortedData.slice(i, i + limit));
    }

    const adjustedIndex = selected_batch - 1;

    if (adjustedIndex >= 0 && adjustedIndex < groupedData.length) {
      const selectedSubarray = groupedData[adjustedIndex];

      const responseData = {
        data: selectedSubarray.map((item) => item),
        total_data: sortedData.length,
        total_batch: groupedData.length,
        total_data_in_batch: selectedSubarray.length,
        current_batch: selected_batch,
      };

      res.json(responseData);
    } else {
      res.status(404).json({ error: "Selected subarray not found" });
    }
  } catch (error) {
    console.error("Error reading CSV file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/predict_proba", (req, res) => {
  try {
    let {
      customer_id,
      latest_category_1,
      latest_category_2,
      latest_category_3,
      latest_category_4,
      latest_category_5,
    } = req.body;

    if (!customer_id) {
      return res.status(400).json({ error: "customer_id must be filled" });
    }

    customer_id = String(customer_id);

    const categoryMapping = {
      Automotive: 0,
      Beauty: 1,
      "Books & Media": 2,
      Clothing: 3,
      Electronics: 4,
      "Food & Grocery": 5,
      Furniture: 6,
      "Health & Wellness": 7,
      "Home & Kitchen": 8,
      "Jewelry & Accessories": 9,
      "Office Supplies": 10,
      "Pet Supplies": 11,
      "Sports & Outdoors": 12,
      "Toys & Games": 13,
      "": 14,
    };

    const features = JSON.stringify({
      latest_category_1: [parseInt(categoryMapping[latest_category_1])],
      latest_category_2: [parseInt(categoryMapping[latest_category_2])],
      latest_category_3: [parseInt(categoryMapping[latest_category_3])],
      latest_category_4: [parseInt(categoryMapping[latest_category_4])],
      latest_category_5: [parseInt(categoryMapping[latest_category_5])],
    });

    const pythonProcess = spawn("python", [
      "script.py",
      JSON.stringify(features),
    ]);

    let dataBuffer = "";
    pythonProcess.stdout.on("data", (data) => {
      dataBuffer += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Error from Python script: ${data}`);
      res.status(500).json({ error: "Internal Server Error" });
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(dataBuffer);

          const sortedIndices = Array.from(result.keys()).sort(
            (a, b) => result[b] - result[a]
          );

          const sortedProba = sortedIndices.map((index) => result[index]);

          const categories = sortedIndices.map(
            (index) => Object.keys(categoryMapping)[index]
          );

          const categoryObject = {};
          categories.forEach((key, i) => {
            categoryObject[key] = sortedProba[i];
          });

          res.json({
            customer_id: customer_id,
            recommendation: categoryObject,
          });
        } catch (parseError) {
          console.error("Error parsing Python script output:", parseError);
          res.status(500).json({ error: "Internal Server Error" });
        }
      } else {
        console.error(`Python script exited with code ${code}`);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3700;
app.listen(PORT, () => {
  console.log(`Server running at https://terra-store-web.netlify.app/${PORT}/`);
});
