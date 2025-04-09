import { GoogleGenerativeAI } from "@google/generative-ai";
import { connect } from "@/db/dbConfig";
import Recipe from "@/models/recipeModel";
import { NextRequest, NextResponse } from "next/server";

connect();

//GEMINI Ai Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { ingredients } = reqBody;
    console.log("Ingredients:", ingredients);

    // Check if there is an existing recipe in the database with the introduced ingredients
    const existingRecipe = await Recipe.findOne({
      ingredients: { $all: ingredients.sort() },
    });

    if (existingRecipe) {
      console.log("Recipe found in database");
      return JSON.parse(existingRecipe.recipe_content);
    }

    // If the recipe doesn't exist, generate a new one
    const recipePrompt = `
      Create a detailed recipe using only the following ingredients:
      ${ingredients.join(", ")}

      Format the recipe as an HTML body with semantic elements.
      Return the result in JSON format:
      {
        "title": "Recipe Title",
        "cookingTime": "Cooking time in minutes"
        "recipe": "Recipe formatted in HTML",
      }
      Do not include markdown formatting (e.g., do not wrap JSON in \`\`\`json ... \`\`\`).
    `;
    //Gemini API call
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const response = await model.generateContent(recipePrompt);
    let textResponse = response.response.text();

    // console.log("Gemini Response (Raw):", textResponse);

    const cleanedResponse = textResponse.replace(/```json|```/g, "").trim();

    // Parse Json
    const recipeData = JSON.parse(cleanedResponse);

    const recipeTitle = recipeData.title;
    const recipeInstructions = recipeData.recipe;
    const cookingTime = recipeData.cookingTime || 30;

    //TO DO:Imagine generator

    //Store recipe in MongoDB
    const newRecipe = new Recipe({
      title: recipeTitle,
      ingredients,
      instructions: recipeInstructions,
      cookingTime: cookingTime,
      userOwner: null,
      createdAt: new Date(),
      isGenerated: true,
    });

    const savedRecipe = await newRecipe.save();

    console.log("New recipe saved:", savedRecipe);

    return NextResponse.json({
      message: "Recipe generated and saved successfully",
      success: true,
      savedRecipe,
    });
  } catch (error: any) {
    console.error("Error generating recipe:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
