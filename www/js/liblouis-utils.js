var initialInputText = document.querySelector("#initialInputText");
var processedText = document.querySelector("#processedText");

// liblouis.enableOnDemandTableLoading();

var PAIGE_CHARACTER_WAIT_TIME_MS = 500;

function logInputText(inputCharacter) {
  initialInputText.disabled = true;
  checkPotentiometerValue();
  var lines = inputCharacter.split("\n");
  var lastLineIsEmpty = lines.at(-1).length === 0;
  var inputHasMoreThanOneLine = lines.length > 1;
  var secondLastLineHas15 = true;
  if (inputHasMoreThanOneLine) secondLastLineHas15 = lines.at(-2).length === 15;
  if (lastLineIsEmpty && !secondLastLineHas15) {
    initialInputText.value = inputCharacter.trim();
    console.log("Input disabled as previous line does not have 15 characters");
  } else if (inputCharacter.length === 1) {
    SendHomeCommand();
    setTimeout(function () {
      macro_command("SD", "initial.gcode");
      setTimeout(function () {
        initialInputText.value = initialInputText.value.toUpperCase();
        var upperInput = inputCharacter.toUpperCase();
        var index = upperInput.length - 1;
        var AsciiBase10 = upperInput.charCodeAt(index);
        var fileName = getAsciiFileName(AsciiBase10);
        if (!["2", "3", "4", "5"].includes(fileName[0])) {
          initialInputText.value = inputCharacter.slice(0, -1);
          console.log(
            "Input disabled as input character outside of know ASCII braille range"
          );
        } else {
          processedText.value = initialInputText.value.toUpperCase();
          var gcodeFileName = fileName + ".gcode";
          console.log("attempting to run command");
          console.log(gcodeFileName);
          macro_command("SD", gcodeFileName);
        }
      }, 1000);
    }, 2000);
  } else if (lines.at(-1).length > 15) {
    initialInputText.value = inputCharacter.slice(0, -1);
    console.log("Input disabled as current line already has 15 characters");
  } else if (lines.length === 6 && lines.at(-1).length === 1) {
    initialInputText.value = inputCharacter.slice(0, -1);
    console.log(
      "Input disabled as line already has 6 lines and a new line character"
    );
  } else if (lastLineIsEmpty) {
    // Last character was a new line character thus we want to execute the new line macro
    processedText.value = initialInputText.value;
    console.log("Executing the new line macro");
    macro_command("SD", "A.gcode");
  } else {
    initialInputText.value = initialInputText.value.toUpperCase();
    var upperInput = inputCharacter.toUpperCase();
    var index = upperInput.length - 1;
    var AsciiBase10 = upperInput.charCodeAt(index);
    var fileName = getAsciiFileName(AsciiBase10);
    if (!["2", "3", "4", "5"].includes(fileName[0])) {
      initialInputText.value = inputCharacter.slice(0, -1);
      console.log(
        "Input disabled as input character outside of know ASCII braille range"
      );
    } else {
      processedText.value = initialInputText.value.toUpperCase();
      var gcodeFileName = fileName + ".gcode";
      console.log("attempting to run command");
      console.log(gcodeFileName);
      macro_command("SD", gcodeFileName);
    }
  }
  if (inputCharacter.length === 1) {
    setTimeout(function () {
      initialInputText.disabled = false;
    }, 3000 + PAIGE_CHARACTER_WAIT_TIME_MS);
  } else {
    setTimeout(function () {
      initialInputText.disabled = false;
    }, PAIGE_CHARACTER_WAIT_TIME_MS);
  }
}

function getAsciiFileName(AsciiBase10) {
  var AsciiBase16 = AsciiBase10.toString(16);
  var AsciiBase16FileName = AsciiBase16.toUpperCase();
  return AsciiBase16FileName;
}

function saveTextInput() {
  console.log("Attempting to save");
  PAIGE_files_start_upload(initialInputText.value);
  console.log("Saved Text");
}

function clearTextInput() {
  console.log("Attempting to clear");
  macro_command("SD", "clear.gcode");
  setTimeout(function () {
    console.log("Attempting to home");
    SendHomeCommand();
    setTimeout(function () {
      macro_command("SD", "initial.gcode");
      setTimeout(function () {
        initialInputText.value = "";
        processedText.value = "";
      }, 2000);
    }, 2000);
  }, 6000);
}

function checkPotentiometerValue() {
  // console.log({ PAIGE_POTENT_VALUE: PAIGE_POTENT_VALUE });
}
