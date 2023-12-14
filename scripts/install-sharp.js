const { execSync } = require("child_process");
const os = require("os");

// Check the operating system
const isWindows = os.platform() === "win32";
console.log("isWindows :", isWindows);

// Define the dependencies based on the operating system
const dependencies = isWindows
  ? ["@img/sharp-win32-x64"]
  : ["@img/sharp-linux-x64"];

// Install the appropriate dependency
dependencies.forEach((dependency) => {
  try {
    console.log("Installing :-", `npm install --force ${dependency}`);
    execSync(`npm install --force ${dependency}  --no-save`);
  } catch (error) {
    console.error(`Failed to install ${dependency}: ${error.message}`);
    process.exit(1);
  }
});

console.log("Dependencies installed successfully.");
