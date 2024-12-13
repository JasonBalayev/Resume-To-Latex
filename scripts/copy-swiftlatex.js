const fs = require('fs')
const path = require('path')

const sourceDir = path.join(__dirname, '../node_modules/swiftlatex/dist')
const targetDir = path.join(__dirname, '../public')

// Create public directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true })
}

// Copy files
fs.readdirSync(sourceDir).forEach(file => {
  if (file.startsWith('swift') || file.endsWith('.wasm')) {
    fs.copyFileSync(
      path.join(sourceDir, file),
      path.join(targetDir, file)
    )
  }
}) 