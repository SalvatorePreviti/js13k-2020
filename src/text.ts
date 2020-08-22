const element = document.getElementById('T')
interface Text {
  text: string
  timeout: number
}

const EMPTY: Text = { text: '', timeout: -1 }

let currentText: Text = EMPTY
const textQueue: Text[] = []

//Intention:
//if a timeout is passed then it will be shown for that long before either being
//        cleared or moving onto the next bit of text
//If no timeout is passed (or negative timeout) then it goes to the back of the queue
//        replacing any other text with negative timeout at the back of the queue.
//        This text will show until another setText is called
function setText(text: string, timeout: number = -1) {
  const textObject = { text, timeout }
  //If the last item in the queue (we pop from the end of the queue, so last one is [0]) has a timeout of -1
  if (textQueue[0]) {
    //if the item we're adding also has a timeout of -1 then replace it:
    if (timeout < 0) {
      textQueue[0] = textObject
    } else {
      //otherwise, place this item at the back of the queue but in front of the timeout=0 item
      textQueue.splice(1, 0, textObject)
    }
  } else {
    //place it at the back of the queue, with an empty one afterwards to clear it once it times out
    textQueue.unshift(textObject)
    if (timeout > 0) {
      textQueue.unshift(EMPTY)
    }
  }
}

function updateText(dt) {
  if (currentText && currentText.timeout > 0) {
    currentText.timeout -= dt
  }

  if (currentText.timeout < 0 && textQueue[0]) {
    currentText = textQueue.pop()
    element.innerHTML = currentText.text
  }
}

export { setText, updateText }
