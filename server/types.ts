import type { Store } from "express-session";
import type { 
  User, Product, Order, Address,
  InsertUser, InsertProduct, InsertOrder, InsertAddress 
} from "@shared/schema";

export interface IStorage {
  sessionStore: Store;

  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser & { isAdmin?: boolean }): Promise<User>;

  // Address operations
  getAddresses(userId: number): Promise<Address[]>;
  getAddress(id: number): Promise<Address | undefined>;
  createAddress(userId: number, address: InsertAddress): Promise<Address>;
  updateAddress(id: number, address: Partial<Address>): Promise<Address | undefined>;
  deleteAddress(id: number): Promise<boolean>;

  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Order operations
  getOrders(): Promise<Order[]>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
}