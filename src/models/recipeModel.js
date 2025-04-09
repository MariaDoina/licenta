import { create } from "domain";
import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cookingTime: { type: Number, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: String, required: true },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: false,
  },
  createdAt: { type: Date, default: Date.now },
  isGenerated: { type: Boolean, default: false },
});

const Recipe =
  mongoose.models.recipes || mongoose.model("recipes", recipeSchema);

export default Recipe;
