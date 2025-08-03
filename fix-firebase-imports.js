const fs = require("fs");
const path = require("path");
const glob = require("glob");

const files = glob.sync("./src/**/*.{js,jsx,ts,tsx}");

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf8");

  // Replace all ../../../lib/firebase or ../../lib/firebase
  content = content.replace(/from\s+["'`](?:\.\.\/)+lib\/firebase["'`]/g, `from "@/lib/firebase"`);
  content = content.replace(/from\s+["'`]@\/lib\/firebase["'`]/g, `from "@/lib/firebase"`);

  fs.writeFileSync(file, content, "utf8");
  console.log(`✅ Fixed import in: ${file}`);
});

console.log("\n🎉 All firebase imports fixed. Now run: npm run build");
