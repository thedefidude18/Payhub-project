import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function seedSupabaseAuthUsers() {
  // Admin
  await supabase.auth.admin.createUser({
    email: "admin@payvidi.com",
    password: "admin1234",
    user_metadata: { role: "admin", firstName: "Admin", lastName: "User" },
    email_confirm: true,
  });
  // Freelancer
  await supabase.auth.admin.createUser({
    email: "freelancer@payvidi.com",
    password: "freelancer1234",
    user_metadata: { role: "freelancer", firstName: "John", lastName: "Freelancer" },
    email_confirm: true,
  });
}

export async function seedDatabase() {
  try {
    console.log("Seeding database...");

    await seedSupabaseAuthUsers();

    // Seed admin user
    const adminExists = await db.select().from(users).where(eq(users.id, "admin-seed-123"));
    if (adminExists.length === 0) {
      await db.insert(users).values({
        id: "admin-seed-123",
        email: "admin@payvidi.com",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        subdomain: "admin",
        commissionRate: "10",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("✓ Admin user seeded");
    }

    // Seed freelancer user
    const freelancerExists = await db.select().from(users).where(eq(users.id, "freelancer-seed-456"));
    if (freelancerExists.length === 0) {
      await db.insert(users).values({
        id: "freelancer-seed-456",
        email: "freelancer@payvidi.com",
        firstName: "John",
        lastName: "Freelancer",
        role: "freelancer",
        subdomain: "johnfreelancer",
        commissionRate: "15",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("✓ Freelancer user seeded");
    }

    // Seed super freelancer user
    const superFreelancerExists = await db.select().from(users).where(eq(users.id, "superfreelancer-seed-789"));
    if (superFreelancerExists.length === 0) {
      await db.insert(users).values({
        id: "superfreelancer-seed-789",
        email: "super@payvidi.com",
        firstName: "Jane",
        lastName: "Super",
        role: "superfreelancer",
        subdomain: "janesuper",
        commissionRate: "10",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("✓ Super freelancer user seeded");
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}