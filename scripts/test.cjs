#!/usr/bin/env node

const path = require("path")
const { execSync } = require("child_process")

console.log("🧪 Running tests...")

try {
  // Check if dist files exist
  const fs = require("fs")
  const distDir = path.join(__dirname, "..", "dist")

  if (!fs.existsSync(distDir)) {
    console.log("⚠️  dist folder not found. Running build first...")
    execSync("npm run build", { stdio: "inherit" })
  }

  // Verify build artifacts
  const cjsFile = path.join(distDir, "index.cjs")
  const mjsFile = path.join(distDir, "index.mjs")
  const dtsFile = path.join(distDir, "index.d.ts")

  const checks = [
    { file: cjsFile, format: "CommonJS (.cjs)" },
    { file: mjsFile, format: "ES Module (.mjs)" },
    { file: dtsFile, format: "TypeScript (.d.ts)" },
  ]

  let allPassed = true

  for (const check of checks) {
    if (fs.existsSync(check.file)) {
      const size = (fs.statSync(check.file).size / 1024).toFixed(2)
      console.log(`✅ ${check.format}: ${size}KB`)
    } else {
      console.log(`❌ ${check.format}: NOT FOUND`)
      allPassed = false
    }
  }

  // Basic syntax check
  try {
    const TelegramBot = require(cjsFile)
    if (typeof TelegramBot === "function" || typeof TelegramBot.default === "function") {
      console.log(`✅ CommonJS export is valid`)
    }
  } catch (e) {
    console.log(`❌ CommonJS export error: ${e.message}`)
    allPassed = false
  }

  if (allPassed) {
    console.log("\n✅ All tests passed!")
    process.exit(0)
  } else {
    console.log("\n❌ Some tests failed!")
    process.exit(1)
  }
} catch (error) {
  console.error("❌ Test error:", error.message)
  process.exit(1)
}
