const db = require('../db');

const getAllTodos = async (req, res) => {
  try {
    const result = await db.pool.query('SELECT * FROM todos ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

const createTodo = async (req, res) => {
  const { title, author } = req.body;
  
  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required' });
  }

  try {
    const result = await db.pool.query(
      'INSERT INTO todos (title, author) VALUES ($1, $2) RETURNING *',
      [title, author]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

const updateTodo = async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, author, is_active } = req.body;

  if (!title || !author || typeof is_active !== 'boolean') {
    return res.status(400).json({ error: 'Invalid data' });
  }

  try {
    const result = await db.pool.query(
      `UPDATE todos 
       SET title = $1, author = $2, is_active = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4 RETURNING *`,
      [title, author, is_active, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

const toggleTodoStatus = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await db.pool.query(
      `UPDATE todos 
       SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

const deleteTodo = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await db.pool.query(
      'DELETE FROM todos WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  toggleTodoStatus,
  deleteTodo
};