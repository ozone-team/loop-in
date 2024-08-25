import { Seed } from "./scripts/seed";

export async function register() {
    await Seed().catch(() => {
        console.error("Failed to seed database");
    });
}