export class Controls {
  forward: boolean
  reverse: boolean
  left: boolean
  right: boolean

  constructor(controlType: "keyboard" | "traffic-ai") {
    this.forward = controlType === "traffic-ai"
    this.reverse = false
    this.left = false
    this.right = false

    if (controlType === "keyboard") this.#addKeybaordListeners()
  }

  #addKeybaordListeners() {
    document.onkeydown = event => {
      switch (event.key) {
        case "ArrowLeft": {
          this.left = true
          break
        }
        case "ArrowRight": {
          this.right = true
          break
        }
        case "ArrowUp": {
          this.forward = true
          break
        }
        case "ArrowDown": {
          this.reverse = true
          break
        }
      }
    }

    document.onkeyup = event => {
      switch (event.key) {
        case "ArrowLeft": {
          this.left = false
          break
        }
        case "ArrowRight": {
          this.right = false
          break
        }
        case "ArrowUp": {
          this.forward = false
          break
        }
        case "ArrowDown": {
          this.reverse = false
          break
        }
      }
    }
  }
}
