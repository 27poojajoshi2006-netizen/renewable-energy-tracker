require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Energy Schema
const energySchema = new mongoose.Schema({
  source: String,
  generated: Number,
});

const Energy = mongoose.model("Energy", energySchema);

// Save energy data
app.post("/api/energy", async (req, res) => {
  try {
    const { source, generated } = req.body;

    const energy = new Energy({
      source,
      generated,
    });


    await energy.save();

    res.json({
      message: "Energy data saved successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to save energy data",
    });
  }
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
  app.get("/api/energy", async (req, res) => {
  try {
    const energyData = await Energy.find();
    res.json(energyData);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch energy data"
    });
  }
});