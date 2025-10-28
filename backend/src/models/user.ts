import { pool } from "./db";

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  role?: "admin" | "user";
}

export const createUser = async (user: User) => {
  const { username, email, password, role = "user" } = user;
  const result = await pool.query(
    `INSERT INTO users (username, email, password, role) 
     VALUES ($1, $2, $3, $4) RETURNING id, username, email, role`,
    [username, email, password, role]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  return result.rows[0];
};

export const findUserById = async (id: number) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result.rows[0];
};
