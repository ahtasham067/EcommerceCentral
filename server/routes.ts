import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertProductSchema, insertOrderSchema } from "@shared/schema";
import { z } from "zod";

function isAdmin(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
  if (!req.user?.isAdmin) {
    return res.status(403).send("Admin access required");
  }
  next();
}

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Products
  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).send("Product not found");
    res.json(product);
  });

  app.post("/api/products", isAdmin, async (req, res) => {
    const result = insertProductSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json(result.error);
    
    const product = await storage.createProduct(result.data);
    res.status(201).json(product);
  });

  app.patch("/api/products/:id", isAdmin, async (req, res) => {
    const product = await storage.updateProduct(Number(req.params.id), req.body);
    if (!product) return res.status(404).send("Product not found");
    res.json(product);
  });

  app.delete("/api/products/:id", isAdmin, async (req, res) => {
    const success = await storage.deleteProduct(Number(req.params.id));
    if (!success) return res.status(404).send("Product not found");
    res.sendStatus(200);
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    
    const orders = req.user.isAdmin 
      ? await storage.getOrders()
      : await storage.getOrdersByUser(req.user.id);
    res.json(orders);
  });

  app.post("/api/orders", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    
    const result = insertOrderSchema.safeParse({
      ...req.body,
      userId: req.user.id
    });
    if (!result.success) return res.status(400).json(result.error);
    
    const order = await storage.createOrder(result.data);
    res.status(201).json(order);
  });

  app.patch("/api/orders/:id/status", isAdmin, async (req, res) => {
    const statusSchema = z.object({ status: z.string() });
    const result = statusSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json(result.error);
    
    const order = await storage.updateOrderStatus(
      Number(req.params.id),
      result.data.status
    );
    if (!order) return res.status(404).send("Order not found");
    res.json(order);
  });

  const httpServer = createServer(app);
  return httpServer;
}
