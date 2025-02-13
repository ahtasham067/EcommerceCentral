import { Router } from "express";
import { storage } from "../storage";
import { insertAddressSchema } from "@shared/schema";

const router = Router();

// Get all addresses for the current user
router.get("/api/addresses", async (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  const addresses = await storage.getAddresses(req.user.id);
  res.json(addresses);
});

// Create a new address
router.post("/api/addresses", async (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  const result = insertAddressSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result.error);
  }

  const address = await storage.createAddress(req.user.id, result.data);
  res.status(201).json(address);
});

// Update an address
router.patch("/api/addresses/:id", async (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  const result = insertAddressSchema.partial().safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result.error);
  }

  const address = await storage.updateAddress(Number(req.params.id), result.data);
  if (!address) {
    return res.sendStatus(404);
  }

  res.json(address);
});

// Delete an address
router.delete("/api/addresses/:id", async (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  const success = await storage.deleteAddress(Number(req.params.id));
  if (!success) {
    return res.sendStatus(404);
  }

  res.sendStatus(204);
});

export default router;
