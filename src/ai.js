
/**
 * Chef Claude - Groq AI Integration
 * File: src/ai.js
 */

const SYSTEM_PROMPT = `
You are a helpful chef.

You receive a list of ingredients from the user
and suggest a recipe they could make.

You do not need to use every ingredient.

You may suggest a few additional ingredients
if necessary.

Format your response in Markdown.

Include:
1. Recipe name
2. Ingredients with quantities
3. Step-by-step cooking instructions
4. Preparation and cooking time
5. Serving suggestions

Keep the recipe simple, practical, and easy to follow.
`;

/**
 * Generate Recipe Using Groq API
 * Function name retained for Main.jsx compatibility.
 */
export async function getRecipeFromMistral(ingredientsArr) {

    if (
        !Array.isArray(ingredientsArr) ||
        ingredientsArr.length === 0
    ) {
        throw new Error("Please add ingredients first.");
    }

    const ingredientsString = ingredientsArr.join(", ");

    try {

        const response = await fetch(
            "http://localhost:3001/api/recipe",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ingredients: ingredientsArr,
                    prompt: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
                    systemPrompt: SYSTEM_PROMPT
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Failed to generate recipe."
            );
        }

        const recipe = data.recipe;

        if (!recipe) {
            throw new Error("No recipe was returned.");
        }

        return recipe;

    } catch (err) {

        console.error("Recipe generation failed:", err);
        console.error("Error message:", err.message);

        throw err;
    }
}
