
import React from "react";
import IngredientsList from "./IngredientsList";
import ClaudeRecipe from "./ClaudeRecipe";

import { getRecipeFromMistral } from "../ai";

// import { getRecipeFromChefClaude, getRecipeFromMistral } from "../ai";



export default function Main() {
    const [ingredients, setIngredients] = React.useState([]);
    const [recipe, setRecipe] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    // async function getRecipe() {
    //     const recipeMarkdown = await getRecipeFromChefClaude(ingredients)
    //     setRecipe(recipeMarkdown)
    // }


async function getRecipe() {
    if (isLoading) return;

    setIsLoading(true);
    setRecipe("");

    try {
        const recipeMarkdown = await getRecipeFromMistral(ingredients);
        setRecipe(recipeMarkdown);
    } catch (error) {
        console.error("Error generating recipe:", error);
        setRecipe("Sorry, something went wrong while generating your recipe.");
    } finally {
        setIsLoading(false);
    }
}


    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    }

    return (
        <main>
            <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>

            {ingredients.length > 0 &&
                <IngredientsList
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                    isLoading={isLoading}
                />
            }

            {recipe && <ClaudeRecipe recipe={recipe} />}
        </main>
    )
}