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
    const normalizedIngredients = ingredients
      .map((i: string) => i.trim().toLowerCase())
      .sort();
    console.log("Normalized Ingredients:", normalizedIngredients);

    const existingRecipe = await Recipe.findOne({
      ingredients: {
        $all: normalizedIngredients,
      },
    });

    if (existingRecipe) {
      console.log("Recipe found in database");
      return NextResponse.json({
        success: true,
        message: "Recipe found in database",
        recipe: {
          title: existingRecipe.title,
          ingredients: existingRecipe.ingredients,
          instructions: existingRecipe.instructions,
          cookingTime: existingRecipe.cookingTime,
        },
      });
    }

    // If the recipe doesn't exist, generate a new one
    const recipePrompt = `
         Create a detailed recipe using the following ingredients (correct obvious spelling mistakes if any):
        ${ingredients.join(", ")}

        Respond in JSON format (no markdown formatting):
        {
          "title": "Short recipe title (maximum 5 words)",
          "cookingTime": "Cooking time in minutes",
          "difficulty": "easy | medium | hard",
          "tags": ["tag1", "tag2", "tag3"],
          "ingredients": ["list of ingredients"],
          "instructions": "Plain text step-by-step instructions, without numbering or bullet points, written in normal paragraph form.",
          "htmlInstructions": "Same instructions formatted nicely in HTML (semantic tags)"
        }

        Rules:
        - If any ingredient names are misspelled, correct them before generating the recipe.
        - The "title" must be short and catchy (max 5 words).
        - "instructions" must be simple plain text, no HTML, no markdown.
        - "htmlInstructions" must contain the formatted version using HTML tags like <h2>, <ul>, <li>, <p>.
        - Do NOT use markdown formatting.
        - Do NOT wrap the response in \`\`\`json or any other code block.
        - Only return valid parsable JSON.

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
    const recipeInstructions = recipeData.instructions;
    const cookingTime = recipeData.cookingTime || 30;
    const difficulty = recipeData.difficulty || "medium";
    const tags = recipeData.tags || [];

    //TO DO:Imagine generator

    //Store recipe in MongoDB
    const newRecipe = new Recipe({
      title: recipeTitle,
      ingredients: recipeData.ingredients,
      instructions: recipeInstructions,
      cookingTime: cookingTime,
      userOwner: null,
      createdAt: new Date(),
      isGenerated: true,
      difficulty,
      tags,
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
