var initialInputText = document.querySelector("#initialInputText");
var processedText = document.querySelector("#processedText");
var translatedText = document.querySelector("#translated");

var unicode_file_name = 'unicode.dis';
var en_gb_file_name = 'en-gb-g1.utb';

var PAIGE_CHARACTER_WAIT_TIME_MS = 100;

function logInputText(inputCharacter) {
  var lines = inputCharacter.split("\n");
  console.log(lines);
  var validBarPosition = checkPotentiometerValue(lines.length) || IS_UI_TEST;
  var lastLineIsEmpty = lines.at(-1).length === 0;
  var inputHasMoreThanOneLine = lines.length > 1;
  var secondLastLineHas15 = true;
  if (inputHasMoreThanOneLine) secondLastLineHas15 = lines.at(-2).length === 15;
  if (lastLineIsEmpty && !secondLastLineHas15) {
    initialInputText.value = inputCharacter.trim();
    console.log("Input disabled as previous line does not have 15 characters");
  } else if (inputCharacter.length === 1) {
    SendHomeCommand();
    PAIGESimpleReadSPIFFFile("initial.gcode");
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
    } else if (!validBarPosition) {
      initialInputText.value = inputCharacter.slice(0, -1);
      console.log("Invalid bar position", PAIGE_POTENT_VALUE);
    } else {
      processedText.value = initialInputText.value.toUpperCase();
      var gcodeFileName = fileName + ".gcode";
      console.log("attempting to run command");
      console.log(gcodeFileName);
      PAIGESimpleReadSPIFFFile(gcodeFileName);
    }
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
    PAIGESimpleReadSPIFFFile("A.gcode");
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
    } else if (!validBarPosition) {
      initialInputText.value = inputCharacter.slice(0, -1);
      console.log("Invalid bar position", PAIGE_POTENT_VALUE);
    } else {
      processedText.value = initialInputText.value.toUpperCase();
      var gcodeFileName = fileName + ".gcode";
      console.log("attempting to run command");
      console.log(gcodeFileName);
      PAIGESimpleReadSPIFFFile(gcodeFileName);
    }
  }
  liblouisTranslation();
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
  macro_command("ESP", "clear.gcode");
  setTimeout(function () {
    console.log("Attempting to home");
    SendDisableCommand();
    setTimeout(function () {
      initialInputText.value = "";
      processedText.value = "";
    }, 1000);
  }, 1000);
}

function liblouisTranslation() {
  try {
    const translation = liblouis.backTranslateString("unicode.dis,en-gb-g1.utb", initialInputText.value);
    console.log("Translation:", translation);
    translatedText.value = translation;
  } catch(e) {
    console.error("Error with liblouis translation", e);
  }
}

function checkPotentiometerValue(line) {
  console.log({ PAIGE_POTENT_VALUE: PAIGE_POTENT_VALUE });
  if (line === 1) {
    if ((PAIGE_POTENT_VALUE >= 4) & (PAIGE_POTENT_VALUE <= 12)) return true;
  }
  if (line === 2) {
    if ((PAIGE_POTENT_VALUE >= 16) & (PAIGE_POTENT_VALUE <= 24)) return true;
  }
  if (line === 3) {
    if ((PAIGE_POTENT_VALUE >= 27) & (PAIGE_POTENT_VALUE <= 36)) return true;
  }
  if (line === 4) {
    if ((PAIGE_POTENT_VALUE >= 41) & (PAIGE_POTENT_VALUE <= 48)) return true;
  }
  if (line === 5) {
    if ((PAIGE_POTENT_VALUE >= 52) & (PAIGE_POTENT_VALUE <= 60)) return true;
  }
  return false;
}

function no_backspaces(event) {
  backspace = 8;
  if (event.keyCode == backspace) event.preventDefault();
}


