import { pbkdf2Sync, randomBytes } from "node:crypto";
import { stdin, stdout } from "node:process";

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error("Usage: node tools/generate-admin-password-hash.mjs '<password>'");
  console.error("Password must be at least 12 characters.");
  process.exit(1);
}

const iterations = 310_000;
const salt = randomBytes(16).toString("base64url");
const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("base64url");
console.log(`pbkdf2-sha256$${iterations}$${salt}$${hash}`);
