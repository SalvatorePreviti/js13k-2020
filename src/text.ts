const element = document.getElementById('T')
let currentText = ''

function setText(text: string) {
  if (text !== currentText) {
    element.innerHTML = text
    currentText = text
  }
}

export { setText }
