import { hashPassword } from "./auth";
import { storage } from "./storage";

async function createAdmin() {
  try {
    const hashedPassword = await hashPassword("admin123");
    const admin = await storage.createUser({
      username: "admin",
      password: hashedPassword,
      isAdmin: true
    });
    console.log("Admin user created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin user:", error);
    process.exit(1);
  }
}

createAdmin().catch(console.error);