var initialInputText = document.querySelector("#initialInputText");
var processedText = document.querySelector("#processedText");

// liblouis.enableOnDemandTableLoading();

function logInputText(inputCharacter) {
  // liblouisTranslation();
  checkPotentiometerValue();
  console.log(inputCharacter.split("\n"));
  var lines = inputCharacter.split("\n");
  var lastLineIsEmpty = lines.at(-1).length === 0;
  var inputHasMoreThanOneLine = lines.length > 1;
  var secondLastLineHas15 = true;
  if (inputHasMoreThanOneLine) secondLastLineHas15 = lines.at(-2).length === 15;
  console.log({
    lastLineIsEmpty: lastLineIsEmpty,
    inputHasMoreThanOneLine: inputHasMoreThanOneLine,
    secondLastLineHas15: secondLastLineHas15,
  });
  if (lastLineIsEmpty && !secondLastLineHas15) {
    initialInputText.value = inputCharacter.trim();
    console.log("trimmed line");
  } else if (lines.at(-1).length > 15) {
    initialInputText.value = inputCharacter.slice(0, -1);
  } else if (lines.length === 6 && lines.at(-1).length === 1) {
    initialInputText.value = inputCharacter.slice(0, -1);
  } else if (lastLineIsEmpty) {
    processedText.value = initialInputText.value;
    console.log("executing new line macro");
    // macro_command("SD", "newline.gcode");
  } else {
    processedText.value = initialInputText.value;
    console.log("valid input recieved; executing gcode");
    // macro_command("SD", "paige.gcode");
  }
}

function saveTextInput() {
  console.log("Attempting to save");
  SPIFFS_UploadText(initialInputText.value);
  console.log("Saved Text");
}

function clearTextInput() {
  console.log("Attempting to clear");
  // macro_command("SD", "clear.gcode");
  console.log("Attempting to home");
  // SendHomeCommand();
}

// function liblouisTranslation() {
//   console.info(
//     "Liblouis Version with ccall:",
//     liblouisBuild.ccall("lou_version", "string")
//   );
//   console.info("Liblouis Version easy api:", liblouis.version());
// }

function checkPotentiometerValue() {
  console.log({ PAIGE_POTENT_VALUE: PAIGE_POTENT_VALUE });
}
