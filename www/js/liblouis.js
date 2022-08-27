var initialInputText = document.querySelector("#initialInputText");
var processedText = document.querySelector("#processedText");

function logInputText(inputCharacter) {
  console.log("inputCharacter", inputCharacter);
  console.log(initialInputText.value);
  processedText.value = initialInputText.value;
  console.log("wrote to processedText");
}

function saveTextInput() {
  console.log("Attempting to save");
  SPIFFS_UploadText(initialInputText.value);
  console.log("Saved Text");
}
