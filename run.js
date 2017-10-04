/**
 * This is the 'main' program to demonstrate the forbidden words algorithm.
 *   NOTE: This is code is private, and is for demonstration purposes only.
 * @file run.js
 * @author Austin Grabowski
 */

//A false value means that the word can't not exist anywhere
//while a true value means that it cannot exist alone
let included = {
    'beer': false,
    'curse': false,
    'NFL': true,
    'NHL': true
}

//Value is not used
let excluded = {
    'rootbeer': false,
    'curse word': false
}

console.log("Included: ", included);
console.log("Excluded: ", excluded);

let badWords = new ForbiddenWords(included, excluded);


function printResults()
{
    let results = ""
    let len = badWords.caught.length;

    for(let x = 0; x < len; x++)
    {
        results += badWords.caught[x].word + ", ";
    }

    $('#results').text(results);
}

/**
 * Function for when ever the #inputField is changed, perform the forbiddenWords algorithm
 */
$('#inputField').on('input', function()
{
    let input = $('#inputField').val();
    badWords.showBadWords(input, input.length);
    printResults();
});