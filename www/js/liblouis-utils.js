var initialInputText = document.querySelector("#initialInputText");
var processedText = document.querySelector("#processedText");

liblouis.enableOnDemandTableLoading();

function logInputText(inputCharacter) {
  console.log("inputCharacter", inputCharacter);
  console.info(
    "Liblouis Version with ccall:",
    liblouisBuild.ccall("lou_version", "string")
  );
  console.info("Liblouis Version easy api:", liblouis.version());
  console.info("Liblouis Version easy api:", liblouis.version());
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
  }
  if (lines.at(-1).length > 15) {
    initialInputText.value = inputCharacter.slice(0, -1);
  }
  processedText.value = initialInputText.value;
  console.log("wrote to processedText");
  console.log("About to attempt to run gcode");
  macro_command("SD", "paige.gcode");
}

function saveTextInput() {
  console.log("Attempting to save");
  SPIFFS_UploadText(initialInputText.value);
  console.log("Saved Text");
}
