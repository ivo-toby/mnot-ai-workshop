import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Define Todo interface and in‑memory store
interface Todo {
  id: number;
  text: string;
  category: string;
}

const todos: Todo[] = [];
let nextId = 1;

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // your OpenAI API key must be set in the environment
});
const openai = new OpenAIApi(configuration);

// POST /todos: Create a new todo and infer its category via OpenAI
app.post('/todos', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Todo text is required' });

    const prompt = `Determine a concise category for the following todo item: "${text}"`;
    const openaiResponse = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 10,
      temperature: 0.5,
    });
    const category = openaiResponse.data.choices[0]?.text.trim() || "Uncategorized";

    // Create and store the new todo
    const newTodo: Todo = { id: nextId++, text, category };
    todos.push(newTodo);

    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while creating todo' });
  }
});

// GET /todos: Return all stored todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// Serve static files for the React frontend from the build directory:
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
