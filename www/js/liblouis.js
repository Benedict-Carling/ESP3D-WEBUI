var initialInputText = document.querySelector("#initialInputText");
var processedText = document.querySelector("#processedText");

function logInputText() {
  console.log(initialInputText.value);
  processedText.value = initialInputText.value;
  console.log("wrote to processedText");
}
