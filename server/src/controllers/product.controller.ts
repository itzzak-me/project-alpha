import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import db from '../db';

// --- Public Routes ---

/**
 * Get all products
 * ROUTE: GET /api/products
 */
export async function getProducts(req: Request, res: Response) {
  try {
    const products = await db.product.findMany({
      orderBy: { created_at: 'desc' },
    });
    return res.json(products);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to retrieve products' });
  }
}

/**
 * Get a single product by ID
 * ROUTE: GET /api/products/:id
 */
export async function getProductById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const product = await db.product.findUnique({
      where: { id },
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(product);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to retrieve product' });
  }
}

// --- Admin-Only Routes ---

/**
 * Create a new product (ADMIN ONLY)
 * ROUTE: POST /api/products
 */
export async function createProduct(req: Request, res: Response) {
  const { title, description, price_cents, image_url, stock } = req.body;
  
  // Basic validation
  if (!title || !description || price_cents === undefined) {
    return res.status(400).json({ error: 'Missing required product fields' });
  }

  try {
    const newProduct = await db.product.create({
      data: {
        title,
        description,
        price_cents,
        image_url,
        stock,
      },
    });
    return res.status(201).json(newProduct);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to create product' });
  }
}

/**
 * Update an existing product (ADMIN ONLY)
 * ROUTE: PUT /api/products/:id
 */
export async function updateProduct(req: Request, res: Response) {
  const { id } = req.params;
  const { title, description, price_cents, image_url, stock } = req.body;

  try {
    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        title,
        description,
        price_cents,
        image_url,
        stock,
      },
    });
    return res.json(updatedProduct);
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.error(e);
    return res.status(500).json({ error: 'Failed to update product' });
  }
}

/**
 * Delete a product (ADMIN ONLY)
 * ROUTE: DELETE /api/products/:id
 */
export async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await db.product.delete({
      where: { id },
    });
    return res.status(204).send(); // 204 No Content for successful deletion
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.error(e);
    return res.status(500).json({ error: 'Failed to delete product' });
  }
}