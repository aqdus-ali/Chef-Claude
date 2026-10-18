
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.post("/api/recipe", async (req, res) => {
    try {
        const { ingredients } = req.body;

        if (
            !Array.isArray(ingredients) ||
            ingredients.length === 0 ||
            !ingredients.every(
                item => typeof item === "string" &&
                item.trim().length > 0
            )
        ) {
            return res.status(400).json({
                error: "Please provide valid ingredients."
            });
        }

        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({
                error: "Groq API key is missing."
            });
        }

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-20b",
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful chef. Suggest a practical recipe based on the user's ingredients. Format the recipe in Markdown."
                        },
                        {
                            role: "user",
                            content: `I have ${ingredients.join(", ")}. Recommend a recipe.`
                        }
                    ],
                    max_completion_tokens: 1024
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Groq request failed:", response.status, data);

            return res.status(response.status).json({
                error: response.status === 429
                    ? "Groq usage limit reached. Try again later."
                    : data.error?.message || "Recipe generation failed."
            });
        }

        const recipe = data.choices?.[0]?.message?.content;

        if (!recipe) {
            return res.status(502).json({
                error: "No recipe was returned."
            });
        }

        res.json({ recipe });

    } catch (error) {
        console.error("Server error:", error);

        res.status(500).json({
            error: "Unable to generate recipe."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
