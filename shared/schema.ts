import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
});

export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  street: text("street").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
});

export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  image: text("image"),
  categoryId: integer("category_id").references(() => categories.id),
  inventory: integer("inventory").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  status: text("status").notNull().default("pending"),
  total: real("total").notNull(),
  items: jsonb("items").notNull(),
  shippingAddressId: integer("shipping_address_id").references(() => addresses.id),
  paymentMethod: text("payment_method").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAddressSchema = createInsertSchema(addresses).pick({
  street: true,
  city: true,
  state: true,
  postalCode: true,
  country: true,
  isDefault: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  image: true,
  categoryId: true,
  inventory: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  total: true,
  items: true,
  shippingAddressId: true,
  paymentMethod: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertAddress = z.infer<typeof insertAddressSchema>;
export type User = typeof users.$inferSelect;
export type Address = typeof addresses.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Order = typeof orders.$inferSelect;

export type CartItem = {
  productId: number;
  quantity: number;
  product: Product;
};