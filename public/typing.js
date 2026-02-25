const source = document.getElementById("source")
const rendered = document.getElementById("rendered")
const input = document.getElementById("input")
const accuracyEl = document.getElementById("accuracy")

const targetText = source.innerText.trim()
let correct = 0
let total = 0

input.addEventListener("input", () => {
  const typed = input.value
  correct = 0
  total = typed.length

  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === targetText[i]) correct++
  }

  const accuracy = total === 0 ? 100 : ((correct / total) * 100).toFixed(1)
  accuracyEl.textContent = accuracy
})
