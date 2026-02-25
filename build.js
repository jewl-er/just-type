const fs = require("fs")
const path = require("path")
const matter = require("gray-matter")
const { marked } = require("marked")
const hljs = require("highlight.js")

const CONTENT_DIR = "./content"
const DIST_DIR = "./dist"
const TEMPLATE_PATH = "./templates/page.html"

// Configure markdown rendering
marked.setOptions({
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  }
})

if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR)
}

// Read template
const template = fs.readFileSync(TEMPLATE_PATH, "utf-8")

// Build each markdown file
const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith(".md"))

let indexLinks = []

files.forEach(file => {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8")
  const { data, content } = matter(raw)

  if (data.draft) return

  const htmlContent = marked.parse(content)
  const slug = file.replace(".md", "")
  const outputPath = path.join(DIST_DIR, `${slug}.html`)

  const page = template
    .replace("{{TITLE}}", data.title || slug)
    .replace("{{DESCRIPTION}}", data.description || "")
    .replace("{{FRONTMATTER}}", JSON.stringify(data))
    .replace("{{CONTENT}}", htmlContent)

  fs.writeFileSync(outputPath, page)

  indexLinks.push(`<li><a href="${slug}.html">${data.title}</a></li>`)
})

// Build index page
const indexHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Typing Practice</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Typing Practice</h1>
  <ul>
    ${indexLinks.join("\n")}
  </ul>
</body>
</html>
`

fs.writeFileSync(path.join(DIST_DIR, "index.html"), indexHTML)

// Copy public files
fs.cpSync("./public", DIST_DIR, { recursive: true })

console.log("Build complete.")
