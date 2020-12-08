
// clear the text area if the language is changed
var dropdown = document.getElementById("languageOption");
dropdown.onchange = function() {
    let codeInput = document.getElementById("codeInput");
    codeInput.value = "";

}

var comparisonOperators = [">", "<", ">=", "<=", "==", "!="]
var operations = ["+=", "-=", "/=", "*=", "++", "--", "="]
var arithOperations = ["+", "-", "/", "*"]

// when button is clicked, gets the text from the text area:
var getBigOBtn = document.getElementById("getBigOBtn");
getBigOBtn.onclick = function() {
    var codeInput = document.getElementById("codeInput")
    var code = codeInput.value.trim();
    
    // now parse the text
    var result = parseInput(code)

    // set the result
    var resultShow = document.getElementById("resultShow");
    resultShow.innerHTML = result;
}


/* 
    This function should strip out all the for statements in the code
*/
function getForStatements(linesOfCode) {
    let forStatements = [];
    var level = 1;
    linesOfCode.forEach(line => {
        let isFor = line.indexOf("for");
        let isClosingStatement = line.indexOf("}")
        if(isFor > -1) {
            lineObj = {
                "line": line,
                "level": level
            }
            forStatements.push(lineObj);

            // up the level because we are now within the for loop
            level += 1;
        }

        if(isClosingStatement > -1) {
            // down the level because we are now out of a for loop
            level -= 1;
        }
    });

    return forStatements;
}

function checkAlphaNumeric(lexicon) {
    const alphaRegex = "^[a-zA-Z]*$"
    const numericRegex = "^[0-9]*$"
    const alphaNumericRegex = "^[a-zA-Z0-9]*$"

    lexicon = lexicon.trim();

    let mN = lexicon.match(numericRegex)
    let mAN = lexicon.match(alphaNumericRegex)

    var res;
    if(mN) {
        res = "num";
    }
    else if(mAN) {
        if(lexicon[0].match(alphaRegex)) {
            res = "var";
        }
        else {
            res = "err";
        }
    }
    else {
        res = "err";
    }

    return res;

}

function evaluateForStatement(forLine) {
    let forLineSplit = forLine['line'].split("(");
    let level = forLine['level'];
    let forLineLogic = forLineSplit[1].split(";");

    let varInstantiation = forLineLogic[0];
    let range = forLineLogic[1];
    let operation = forLineLogic[2].split(")")[0];

    // read init value
    var initValue = varInstantiation.split("=");
    initValue = initValue[initValue.length - 1];

    // read range stop
    var rangeStop;
    for(var i = 0; i < comparisonOperators.length; i++) {
        let op = comparisonOperators[i];
        if(range.indexOf(op) > -1) {
            let rangeStopSplit = range.split(op);
            rangeStop = rangeStopSplit[rangeStopSplit.length - 1];
            break;
        }
    }

    // read operation
    var operationDone;
    for(var i = 0; i < operations.length; i++) {
        let op = operations[i];
        console.log("Op: " + op);
        if(operation.indexOf(op) > -1) {
            if(op === "=") {
                // a little more complex
                // ensure right side format is => variable op val


                
            }
            else {
                if(op === "++" || op === "--") {
                    let lex = operation.split(op)[0];
                    let typeCheck = checkAlphaNumeric(lex)
  
                    if(typeCheck === "var") {
                        operationDone = "lin";
                    }
                    else {
                        operationDone = "err";
                    }   
                }
                if (op === "+=" || op === "-=") {
                    // ensure right side is numeric and > 0
                    let operationSplit = operation.split(op);
                    let leftLex = operationSplit[0];
                    let rightLex = operationSplit[1];
                    
                    let leftTypeCheck = checkAlphaNumeric(leftLex);
                    let rightTypeCheck = checkAlphaNumeric(rightLex);

                    if(leftTypeCheck === "var") {
                        if(rightTypeCheck === "num") {
                            rightLex = rightLex.trim();
                            let rightLexVal = Number(rightLex);
                            if(rightLexVal > 0) {
                                operationDone = "lin";
                            }
                            else {
                                operationDone = "err";
                            }
                        }
                        else {
                            operationDone = "err";
                        }
                    }
                    else {
                        operationDone = "err";
                    }
                }

                if(op === "*=" || op === "/=") {
                    // ensure right side is numeric and > 1
                    operationDone = "log"
                }
            }
            break;
        }
        operationDone = "err";
    }

    return {
        "eval": operationDone,
        "level": level
    }

}

function getBigONotation(forStatements) {
    var val_results = [];
    forStatements.forEach(forLine => {
        // evaluate the notation of the for loop
        let r = evaluateForStatement(forLine);
        val_results.push(r);
    })

    var bigORes;
    var bigOResVal;
    for(var i = 0; i < val_results.length; i++) {
        let val_result = val_results[i];

        if(val_result['eval'] === "err") {
            bigORes = "An error has occurred. Make sure the syntax of your " +
            "code is correct or that it's logic doesn't create a loop.";
            break;
        }

        else if(val_result['eval'] === "lin") {
            bigORes = "O(N)"
        }

        else if(val_results['eval'] == 'log') {
            bigORes = "O(logN)"
        }

        else {
            bigORes = "Could not calculate."
        }

    }

    return bigORes;

}


// this function should parse the input of the code and determine the big O notation
// params:
//  code: The code input
function parseInput(code) {
    // get the for statement
    let newlineSplit = code.split("\n")
    let forStatements = getForStatements(newlineSplit);
    let result = getBigONotation(forStatements);
    let forStatement = forStatements[0];
    console.log(result)
    return result;
}