import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import { db, todos } from './db';

dotenv.config();
const app = express();
app.use(bodyParser.json());

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

    let category = "Uncategorized";
    
    try {
      const prompt = `Determine a concise category for the following todo item: "${text}"`;
      const openaiResponse = await openai.createCompletion({
        model: 'gpt-3.5-turbo-instruct',
        prompt,
        max_tokens: 10,
        temperature: 0.5,
      });
      category = openaiResponse.data.choices[0]?.text?.trim() || "Uncategorized";
    } catch (error) {
      console.error("OpenAI API error:", error);
      // Continue with default category if OpenAI fails
    }

    // Create and store the new todo using Drizzle ORM
    const newTodo = await db.insert(todos)
      .values({
        text,
        category,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    res.status(201).json(newTodo[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while creating todo' });
  }
});

// GET /todos: Return all stored todos
app.get('/todos', async (req, res) => {
  try {
    const allTodos = await db.select().from(todos).orderBy(todos.createdAt);
    res.json(allTodos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching todos' });
  }
});

// PATCH /todos/:id: Update a todo
app.patch('/todos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { text, category, completed } = req.body;
    
    // Only update fields that are provided
    const updateData: any = { updatedAt: new Date() };
    if (text !== undefined) updateData.text = text;
    if (category !== undefined) updateData.category = category;
    if (completed !== undefined) updateData.completed = completed;
    
    const updatedTodo = await db.update(todos)
      .set(updateData)
      .where(eq(todos.id, id))
      .returning();
      
    if (updatedTodo.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(updatedTodo[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while updating todo' });
  }
});

// DELETE /todos/:id: Delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedTodo = await db.delete(todos)
      .where(eq(todos.id, id))
      .returning();
      
    if (deletedTodo.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while deleting todo' });
  }
});

// Serve static files for the React frontend from the build directory:
app.use(express.static(path.join(__dirname, '../build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
