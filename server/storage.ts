import { IStorage } from "./types";
import { 
  User, Product, Category, Order, Address,
  users, products, categories, orders, addresses,
  type InsertUser, type InsertProduct, type InsertOrder, type InsertAddress 
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser & { isAdmin?: boolean }): Promise<User> {
    const [newUser] = await db.insert(users)
      .values({ ...user, isAdmin: user.isAdmin ?? false })
      .returning();
    return newUser;
  }

  // Address operations
  async getAddresses(userId: number): Promise<Address[]> {
    return await db.select()
      .from(addresses)
      .where(eq(addresses.userId, userId));
  }

  async getAddress(id: number): Promise<Address | undefined> {
    const [address] = await db.select()
      .from(addresses)
      .where(eq(addresses.id, id));
    return address;
  }

  async createAddress(userId: number, address: InsertAddress): Promise<Address> {
    // If this is the first address or marked as default, reset other default addresses
    if (address.isDefault) {
      await db.update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, userId));
    }

    const [newAddress] = await db.insert(addresses)
      .values({ ...address, userId })
      .returning();
    return newAddress;
  }

  async updateAddress(id: number, address: Partial<Address>): Promise<Address | undefined> {
    // If setting as default, reset other default addresses
    if (address.isDefault) {
      const [existingAddress] = await db.select()
        .from(addresses)
        .where(eq(addresses.id, id));
      if (existingAddress) {
        await db.update(addresses)
          .set({ isDefault: false })
          .where(and(
            eq(addresses.userId, existingAddress.userId),
            eq(addresses.isDefault, true)
          ));
      }
    }

    const [updatedAddress] = await db.update(addresses)
      .set(address)
      .where(eq(addresses.id, id))
      .returning();
    return updatedAddress;
  }

  async deleteAddress(id: number): Promise<boolean> {
    const [deletedAddress] = await db.delete(addresses)
      .where(eq(addresses.id, id))
      .returning();
    return !!deletedAddress;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products)
      .values({ ...product, createdAt: new Date() })
      .returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined> {
    const [updatedProduct] = await db.update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const [deletedProduct] = await db.delete(products)
      .where(eq(products.id, id))
      .returning();
    return !!deletedProduct;
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return await db.select()
      .from(orders)
      .where(eq(orders.userId, userId));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders)
      .values({ ...order, status: "pending", createdAt: new Date() })
      .returning();
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }
}

export const storage = new DatabaseStorage();