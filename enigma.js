//building functions- parts of the enigma


//building a lightboard 
function buildLightboard(){
    const lightboard = document.getElementById("lightboard")
    for (let row of keyboardLayout) {
        let newRow = document.createElement("div")
        newRow.classList.add("panel-row")
        for (let key of row) {
            let newLight = document.createElement("div")
            newLight.classList.add("light")
            newLight.innerHTML = key
            newLight.id = "light-" + key
            newRow.appendChild(newLight)
        }
        lightboard.appendChild(newRow)
  }
}


//building a plugbaord
//includes the actual plugboard, the toggle function and handling of user interaction

//mimics opening and closing the plugboard case on a real enigma
function togglePlugboard() {
    let plugboard = document.getElementById("plugboard");

    //check computed style in case the display doesnt set inline properly
    if (window.getComputedStyle(plugboard).display === "none") {
        plugboard.style.display = "flex";
    } 
    else {
        plugboard.style.display = "none";
    }
}

//handles user interaction with  the plugboard
function handlePlugboardClick(event) {
    //get the key that has been pressed
    const key = event.target.innerHTML.toUpperCase()

    //remove connections if they already exist on the button clicked
    //values are default to null which will be false here
    if (plugboardConnections[key]) { 
        //take away from the connection count
        connectionCount--;
        //set the value the clicked button is connected to back to null
        plugboardConnections[key] = null
        //get the corresponding label - set the inner html back to a -
        document.getElementById(`cl-${key}`).innerHTML = "-"
        //remove the clicke button from the opposite connection
        //gets all the keys from the connections e.g. a,b,c etc as a list and goes through each in turn
        Object.keys(plugboardConnections).forEach(
            //k is each of the keys we have found
            k => {
                //checks to see if the value stored in each location in the connections object is equal to the key initialy clicked
                if (plugboardConnections[k] === key) {
                    //if it is then set its label back to -
                    document.getElementById(`cl-${k}`).innerHTML = "-"
                    //reset the value to null too
                    plugboardConnections[k] = null
                }
            }
        )
        //set connecting and from to false it connecting from the button clicked again straight away
        connecting = false;
        from = null;
        //if the button clicked isn't already connected
        //check if we are already in the connecting process - i.e. a button has already been clicke
    } else if (!connecting) {
        //if not then start the connecting process and store the key that has been clicked
        connecting = true;
        from = key;
    } else {
        if (from !== key && connectionCount < 10) {
            //make connection
            connecting = false;
            plugboardConnections[from] = key
            plugboardConnections[key] = from
            document.getElementById(`cl-${key}`).innerHTML = from
            document.getElementById(`cl-${from}`).innerHTML = key
            from = null
            connectionCount++
        }
    }
    console.log(plugboardConnections)
}


function buildPlugboard() {
    const plugboard = document.getElementById("plugboard")
    for (let row of keyboardLayout) {
        let newRow = document.createElement("div")
        newRow.classList.add("panel-row")
        for (let key of row) {

            let newPair = document.createElement("div") 

            let plugButton = document.createElement("button")
            plugButton.classList.add("plug-btn")
            plugButton.onclick = (event) => handlePlugboardClick(event)
            plugButton.innerHTML = key
            let connectionLable = document.createElement("p")
            connectionLable.classList.add("connetion-lable")
            connectionLable.id = "cl-" + key
            connectionLable.innerHTML = "-"

            newPair.appendChild(plugButton)
            newPair.appendChild(connectionLable)
            newRow.appendChild(newPair)
        }
        plugboard.appendChild(newRow)
    }
}

function usePlugboard(letter) {
    //if the letter has a conection, return its pair
    //if not, return the letter
    return plugboardConnections[letter]||letter;
}
    


//building the rotors
//includes the actual rotors and the toggle function
 
//mimics opening the compartment that would store the rotors
function toggleRotors() {
    const rotorControls = document.querySelectorAll(".rotor-controls");
    rotorControls.forEach(rotorControl => {
        //check computed style in case visability isnt set inline properly
        if (window.getComputedStyle(rotorControl).visibility === "hidden") {
            rotorControl.style.visibility = "visible";
        }
        else{
            rotorControl.style.visibility = "hidden";
        }
    });
}

function buildRotors() {
    const rotors = document.getElementById("rotors");

    //buillding the reflector
    const reflector = document.createElement("div")

    //looks the same as the display of the current position so uses the same class
    reflector.className = "rotor-controls";

    const nextReflectorButton = document.createElement("div");
    nextReflectorButton.className = "rotor-btn";
    nextReflectorButton.textContent = "▲";
    nextReflectorButton.onclick = () => nextReflector();

    const selectedReflectorText = document.createElement("div");
    selectedReflectorText.classList.add("selectedRotorText");
    selectedReflectorText.id = "reflector-name";
    selectedReflectorText.textContent = reflectorList[currentReflector].name;

    const prevReflectorButton = document.createElement("div");
    prevReflectorButton.className = "rotor-btn";
    prevReflectorButton.textContent = "▼";
    prevReflectorButton.onclick = () => prevReflector();

    reflector.appendChild(nextReflectorButton);
    reflector.appendChild(selectedReflectorText);
    reflector.appendChild(prevReflectorButton);

     rotors.appendChild(reflector);


    for (let i = 0; i < 3; i++) {
        //ADD ROTOR RING POSITIONS AND ABILITY TO CHANGE THEM HERE 
        //DISPLAYED RING POSITION

        //creating the rotor div into which all parts will be placed
        const rotor = document.createElement("div");
        rotor.className = "rotor";

        //rotor display will show the current state and buttons to shift this up and down
        const rotorPositionDisplay = document.createElement("div");
        rotorPositionDisplay.className = "rotor-display";

        const nextRotorPositionButton = document.createElement("div");
        nextRotorPositionButton.className = "rotor-btn";
        nextRotorPositionButton.textContent = "▲";

        const defaultRotorText = rotorList[i].connections[0]
        const rotorText = document.createElement("div");
        rotorText.id = "rotor-text-" + i
        rotorText.textContent = defaultRotorText

        const prevRotorPositionButton = document.createElement("div");
        prevRotorPositionButton.className = "rotor-btn";
        prevRotorPositionButton.textContent = "▼";

        rotorPositionDisplay.appendChild(nextRotorPositionButton);
        rotorPositionDisplay.appendChild(rotorText);
        rotorPositionDisplay.appendChild(prevRotorPositionButton);

        //controls are hidden and need to be toggled on and off via button
        const rotorControls = document.createElement("div");
        rotorControls.className = "rotor-controls";

        //label containing the rotor:
        const lableDiv = document.createElement("div");
        lableDiv.textContent = "Rotor";

        //div will contain the current rotor being used and the buttons needed to change it
        const selectedRotorDisplay = document.createElement("div");
        //looks identical to the display of the current position so it will use the same class
        selectedRotorDisplay.className = "rotor-display";

        const nextRotorButton = document.createElement("div");
        nextRotorButton.className = "rotor-btn";
        nextRotorButton.textContent = "▲";
        nextRotorButton.onclick = () => nextRotor(i)

        const defaultRotorName = rotorList[i].name
        const selectedrotorText = document.createElement("div");
        selectedrotorText.classList.add("selectedrotorText")
        selectedrotorText.id = "rotor-name-" + i
        selectedrotorText.textContent = defaultRotorName

        const prevRotorButton = document.createElement("div");
        prevRotorButton.className = "rotor-btn";
        prevRotorButton.textContent = "▼";
        prevRotorButton.onclick = () => prevRotor(i)

        selectedRotorDisplay.appendChild(nextRotorButton);
        selectedRotorDisplay.appendChild(selectedrotorText);
        selectedRotorDisplay.appendChild(prevRotorButton);

        rotorControls.appendChild(lableDiv);
        rotorControls.appendChild(selectedRotorDisplay);

        rotor.appendChild(rotorPositionDisplay);
        rotor.appendChild(rotorControls);

        rotors.appendChild(rotor);
    }
}

//function for the ▲ buttom. changes the rotors selected/the rotors ring position
function nextRotor(rotorNumber) {
    //checks to ensure it doesnt go into rotors that dont exist
    if (selectedRotorPositions[rotorNumber] < Object.keys(rotorList).length-1){
        //move the rotor type by one
        let newRotorNumber = selectedRotorPositions[rotorNumber] + 1
        //finds the name of the new rotor from the list
        const newRotorName = rotorList[newRotorNumber].name
        //updates the rotors text display
        document.getElementById("rotor-name-" + rotorNumber).textContent = newRotorName
        //update the selected rotors ring position
        selectedRotorPositions[rotorNumber] = newRotorNumber
        //update rotor text
        //reset position back to 0
        currentRotorPositions[rotorNumber] = 0
        //find and update the matching text for the rotors position
        document.getElementById("rotor-text-" + rotorNumber).textContent = rotorList[newRotorNumber].connections[0]
    }
}

//same as function above but for ▼ instead
function prevRotor(rotorNumber) {
    if (selectedRotorPositions[rotorNumber] > 0) {
        //move the rotor type by one
        let newRotorNumber = selectedRotorPositions[rotorNumber] - 1
        //finds the name of the new rotor from the list
        const newRotorName = rotorList[newRotorNumber].name
        //updates the rotors text display
        document.getElementById("rotor-name-" + rotorNumber).textContent = newRotorName
        //update the selected rotors ring position
        selectedRotorPositions[rotorNumber] = newRotorNumber
        //update rotor text
        //reset position back to 0
        currentRotorPositions[rotorNumber] = 0
        //find and update the matching text for the rotors position
        document.getElementById("rotor-text-" + rotorNumber).textContent = rotorList[newRotorNumber].connections[0]
    }
}

function stepRotors() {
    //Find out if either the fast rotor or the middle rotor is at its notch
    let fastAtNotch = currentRotorPositions[2] === rotorList[2].notch;
    let middleAtNotch = currentRotorPositions[1] === rotorList[1].notch;
  
    //Fast rotor always steps regardless of notches
    moveRotorUp(2);
  
    //The middle rotor steps if either
    //the fast rotor is at its notch
    //on any key press if the middle rotor is at its own notch
    if (fastAtNotch || middleAtNotch) {
      moveRotorUp(1);
    }
  
    //Finally, the slow rotor steps if the middle rotor is at its notch
    //Used as the double-step, when middle rotor gets turned to its notch, it turns again.
    if (middleAtNotch) {
      moveRotorUp(0);
    }
}


function moveRotorUp(rotorNumber) {
    currentRotorPositions[rotorNumber] =
    //increments rotor and loops back around if it 'overflowed'
      (currentRotorPositions[rotorNumber] + 1) % 26;
    document.getElementById("rotor-text-" + rotorNumber).textContent =
      alphabet[currentRotorPositions[rotorNumber]];
}
  
function moveRotorDown(rotorNumber) {
    currentRotorPositions[rotorNumber] = currentRotorPositions[rotorNumber] - 1;
    if (currentRotorPositions[rotorNumber] < 0)
      currentRotorPositions[rotorNumber] =
        currentRotorPositions[rotorNumber] + 26;
    console.log(currentRotorPositions[rotorNumber]);
    document.getElementById("rotor-text-" + rotorNumber).textContent =
      alphabet[currentRotorPositions[rotorNumber]];
}


//we're going left to right through the rotors at first
//so defult reverse to false
//if reverse is true, then the letter is being sent back through the rotor (i.e the return journey)
function useRotor(rotorNumber, letter, reverse = false) {
    //get the specific rotors wiring
    let rotorWiring = rotorList[rotorNumber].connections;
    //get the current rotational position of the selected rotor
    let rotorOffset = currentRotorPositions[rotorNumber];
    //find the letters index in the alphabet
    //i.e A=0, B=1, etc
    let letterIndex = alphabet.indexOf(letter);

    //reverse indicates the letter is oing back through the rotor
    if (reverse) {
        //first the letter index is shifted by the letter offset
        //accounts for the rotor being rotated
        let shiftedIndex = (letterIndex + rotorOffset) % 26;

        //find which letter in the alphabet coresponds to the shifted position in the rotor wiring
        let wiringIndex = rotorWiring.indexOf(alphabet[shiftedIndex]);

        //we then subtract the offset to align the output with the base alphabet
        //this ensures that after rotation, the correct letter is passed to the next rotor
        //the +26 prevents negative numbers, and MOD 26 keeps the result within 0-25 range
        let outputIndex = (wiringIndex - rotorOffset + 26) % 26;

        //convert the number back to a letter
        letter = alphabet[outputIndex];
    }
    //the letter is entering the rotor towards the reflector
    else{
        //shift the letter index forward by the rotor offset to acount for rotaton
        let shiftedIndex = (letterIndex + rotorOffset) % 26;

        //find the letter the rotor maps the sekected input to
        let wiredLetter = rotorWiring[shiftedIndex];

        //convert back to an index and subtract the offset to ensure the correct alignment
        let outputIndex = (alphabet.indexOf(wiredLetter) - rotorOffset + 26) % 26;

        //convert the letter back into a number
        letter = alphabet[outputIndex];
    }
    //return the new letter
    return letter;
}


//building a reflector

function nextReflector() {
    if (currentReflector < Object.keys(reflectorList).length) {
      let selectedReflectorText = document.getElementById("reflector-name");
      currentReflector = currentReflector + 1;
      selectedReflectorText.textContent = reflectorList[currentReflector].name;
    }
}
  
  function prevReflector() {
    if (currentReflector > 0) {
      let selectedReflectorText = document.getElementById("reflector-name");
      currentReflector = currentReflector - 1;
      selectedReflectorText.textContent = reflectorList[currentReflector].name;
    }
}

function useReflector(letter) {
    let reflectorWiring = reflectorList[currentReflector].connections;
    let letterIndex = alphabet.indexOf(letter);
    return reflectorWiring[letterIndex];
}

function buildKeyboard() {
    const keyboard = document.getElementById("keyboard")
    for (let row of keyboardLayout) {
        let newRow = document.createElement("div")
        newRow.classList.add("panel-row")
        for(let key of row) {
            let newLight = document.createElement("div")
            newLight.classList.add("key")
            newLight.innerHTML = key
            newLight.id = "key-" + key
            newLight.onclick = (event) => handleKeyboardClick(event)
            newRow.appendChild(newLight)
        }
        keyboard.appendChild(newRow)
    }
}


//building a keyboard
//includes it skeleton and the key clicking function 

//handle the clicking of the keyboards keys
function handleKeyboardClick(event) {
    //turn off currently active light on the lightboard
    var activeLight = document.querySelector(".on")
    if (activeLight) {
        activeLight.classList.remove("on")
    }

//step rotors
  stepRotors();
  //get key pressed
  var letter = event.target.innerHTML;
  //send through the plugboard
  letter = usePlugboard(letter);
  //send through rotors
  for (let r = 2; r >= 0; r--) {
    letter = useRotor(r, letter);
  }

  //send througth reflectors 
  letter = useReflector(letter);
  //send back through the rotors
  for (let r = 0; r < 3; r++) {
    letter = useRotor(r, letter, true);
  }

  //send through the plugboardd
  letter = usePlugboard(letter);
  console.log(letter);

  //send to the lightboard
  activeLight = document.getElementById("light-" + letter);
  activeLight.classList.add("on");
}

//CREATE PANEL THAT WILL SHOW THE OUTPUTS OF THE ENIGMA MACHINE
//WRITES DOWN THE OUTPUTS IN A 4NUMBER AT A TIME SEQUENCES 

//program code
const keyboardLayout = [
    ["Q", "W", "E", "R", "T", "Z", "U", "I", "O"],
    ["A", "S", "D", "F", "G", "H", "J", "K"],
    ["P", "Y", "X", "C", "V", "B", "N", "M", "L"]
]

const plugboardConnections = {
    A: null,
    B: null,
    C: null,
    D: null,
    E: null,
    F: null,
    G: null,
    H: null,
    I: null,
    J: null,
    K: null,
    L: null,
    M: null,
    N: null,
    O: null,
    P: null,
    Q: null,
    R: null,
    S: null,
    T: null,
    U: null,
    V: null,
    W: null,
    X: null,
    Y: null,
    Z: null,
  };
  
  //all to do with plugboard
  let connectionCount = 0;
  let connecting = false;
  let from = null;
  
  //stores which rotor has been picked for each rotor
  //does NOT store the position of the rotor
  const selectedRotorPositions = [0, 1, 2];
  //stores position of current rotors - to be ticked round
  const currentRotorPositions = [0, 0, 0];
  
  var currentReflector = 1;
  
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
  //list of rotors used by the Wehrmacht
  const rotorList = {
    0: {
      name: "I",
      connections: "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
      notch: alphabet.indexOf("Q"),
    },
    1: {
      name: "II",
      connections: "AJDKSIRUXBLHWTMCQGZNPYFVOE",
      notch: alphabet.indexOf("E"),
    },
    2: {
      name: "III",
      connections: "BDFHJLCPRTXVZNYEIWGAKMUSQO",
      notch: alphabet.indexOf("V"),
    },
    3: {
      name: "IV",
      connections: "ESOVPZJAYQUIRHXLNFTGKDCMWB",
      notch: alphabet.indexOf("J"),
    },
    4: {
      name: "V",
      connections: "VZBRGITYUPSDNHLXAWMJQOFECK",
      notch: alphabet.indexOf("Z"),
    },
  };
  
//these are the two defult reflectors used by the Wehrmacht
  const reflectorList = {
    0: { name: "B", connections: "YRUHQSLDPXNGOKMIEBFZCWVJAT" },
    1: { name: "C", connections: "FVPJIAOYEDRZXWGCTKUQSBNMHL" },
  };
  
  buildPlugboard();
  buildLightboard();
  buildKeyboard();
  buildRotors();