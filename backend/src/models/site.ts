import { pool } from "./db";

export interface Site {
  id?: number;
  site_url: string;
  title: string;
  coverImage?: string;
  description: string;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const createSite = async (site: Site) => {
  const { site_url, title, coverImage, description, category } = site;
  const result = await pool.query(
    `INSERT INTO sites (site_url, title, cover_image, description, category) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [site_url, title, coverImage, description, category]
  );
  return result.rows[0];
};

export const getAllSites = async () => {
  const result = await pool.query(`SELECT * FROM sites ORDER BY created_at DESC`);
  return result.rows;
};

export const getSiteById = async (id: number) => {
  const result = await pool.query(`SELECT * FROM sites WHERE id = $1`, [id]);
  return result.rows[0];
};

export const updateSite = async (id: number, site: Partial<Site>) => {
  const { site_url, title, coverImage, description, category } = site;
  console.log(site)
  const result = await pool.query(
    `UPDATE sites 
     SET site_url=$1, title=$2, cover_image=$3, description=$4, category=$5, updated_at=NOW() 
     WHERE id=$6 RETURNING *`,
    [site_url, title, coverImage, description, category, id]
  );
  console.log(result.rows[0])
  return result.rows[0];
};

export const deleteSite = async (id: number) => {
  await pool.query(`DELETE FROM sites WHERE id = $1`, [id]);
};
