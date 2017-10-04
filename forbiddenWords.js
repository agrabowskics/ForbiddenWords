/**
 * This is the forbidden words algorithm.
 *   NOTE: This is code is private, and is for demonstration purposes only.
 * @file forbiddenWords.js
 * @author Austin Grabowski
 */

class ForbiddenWords
{
    /**
     * Creation of a ForbiddenWords Object
     * @param included A Map of words that are forbidden
     * @param excluded A map of words that are not forbidden
     */
	constructor(included, excluded)
    {
        //Lists used for comparison
        this.included = included;
        this.excluded = excluded;

        //Lists used for calculations
        this.exception = [];
        this.wordArr = [];

        //List used for output
        this.caught = [];
	}

	/**
     * Main Method - Finds bad words in given text
     * @param userInput: Raw user text
     * @param textCount: length of text
     */
	showBadWords(userInput, textCount)
    {
        if (typeof userInput === "undefined" || textCount === 0)
        {
            return;
        }

        //Clear the lists
        this.wordArr = [];
        this.caught = [];
        this.exception = [];

        //Populate the word list
        this.getWords(userInput, userInput.length);

        let wordsLen = this.wordArr.length;
        if(wordsLen > 0)
        {
            //Case One: All words
            //Case Two: Some words
            //Case Three: One word
            this.someWords(this.wordArr, wordsLen);
        }

        //Case Four: In words
        this.inWords(this.wordArr, wordsLen);
        this.removeExceptions();

            //Process complete, Use the lists
            //ToDo: Use elements
    }


    /**
     * Add to the word array
     * @param arr: Target array
     * @param elem: String to add
     * @param startIndex
     * @param endIndex
     */
    addWordElem(arr, elem, startIndex, endIndex) {

        let wordElem = {
            word: elem,
            start: startIndex,
            end: endIndex
        };

        arr.push(wordElem);

    }


    /**
     *Get every word in the given text, and put it in word array for manipulation
     * @param userInput: Raw user text
     * @param len: userInput length
     */

    getWords(userInput, len)
    {

        //Add the first word
        let coor = this.findWord(userInput, len);
        let word = userInput.substring(coor[0],coor[1]+1).toLowerCase();
        this.addWordElem(this.wordArr, word, coor[0], coor[1]);


        //Loop until nothing is found
        while(coor[0] !== -1)
        {
            coor = this.findWord(userInput, len, coor[1]+1);
            //Break when coor doesn't exist
            if(coor[0] === -1)
            {
                break;
            }

            //Add the word

            word = userInput.substring(coor[0],coor[1]+1).toLowerCase();

            this.addWordElem(this.wordArr, word, coor[0], coor[1]);

        }

    }

    /**
     *Find a single word in a given string
     * @param userInput: Raw user input
     * @param len: userInput.len
     * @param start: [OPTIONAL] Start index
     * @returns A coordinate [startIndex, endIndex], An undefined coordinate [-1,-1]
     */
    findWord(userInput, len, start)
    {
        if(len <= 0)
        {
            return;
        }

        if(typeof start === "undefined")
        {
            start = 0;
        }

        let regX = /[a-z]/i;
        //Start with the first letter
        for(let x = start; x < len; x++) {
            //Find the first letter
            if(regX.test(userInput[x])) {
                //Look for the last letter
                for(let y = x; y < len; y++) {
                    //If NOT a letter
                    if(!regX.test(userInput[y]))
                    {
                        return [x,y-1];
                    }
                    //If it is the end of the string
                    if(y === len-1)
                    {
                        return [x,y];
                    }
                }
            }
        }

        //Nothing found

        return [-1,-1];

    }


    /**
     * Add x - y indexes of a word to the exception list
     * @param startIndex
     * @param endIndex
     */

    found(startIndex, endIndex)
    {
        this.exception.push({
            start: startIndex,
            end: endIndex
        });
    }

    /**
     * Check if a coordinate had been found
     * @param startIndex
     * @param endIndex
     * @returns true if found
     */
    removeExceptions() {
        let exceptionLen = this.exception.length;
        let caughtLen = this.caught.length;
        if(caughtLen <= 0 || exceptionLen <= 0)
        {
            return false;
        }

        let exceptionElem, caughtElem;
        //For each element in this.exceptions
        for(let x = 0; x < exceptionLen; x++) {
            exceptionElem = this.exception[x];
            //Check each element in caught
            for(let y = 0; y < caughtLen; y++) {
                caughtElem = this.caught[y];
                //If caught element is in or is an exception
                if(caughtElem.start >= exceptionElem.start && caughtElem.end <= exceptionElem.end) {
                    //remove it
                    this.caught.splice(y , 1);
                    caughtLen--;
                }
            }
        }
        return false;
    }

    /**
     * Checks every possible combination of words in given strings
     * @param words: Array of strings
     * @param wordsLen: Length of the Array, or the size of the longest phrase
     * @param maxPhraseLen: [OPTIONAL] Limits the amount of word combination checks to the max phrase size
     */
    someWords(words, wordsLen, maxPhraseLen)
    {
        //If maxPhraseLen doesn't exist or  is NOT less than word count
        if(typeof maxPhraseLen === "undefined" || !(maxPhraseLen < wordsLen))
        {
            //Check every possible combination
            maxPhraseLen = wordsLen;
        }

        var phrase;
        let word;
        //Check each word
        for(let x = 0; x < wordsLen; x++)
        {
            phrase = '';
            //Check word X with every Y word combination
            for(let y = x, runCount = 0; y < wordsLen; y++, runCount++)
            {
                //Stop at max phrase length
                if(runCount === maxPhraseLen)
                    break;

                word = words[y];
                phrase += word.word;

                //If the phrase/word is excluded
                if (phrase in this.excluded)
                {
                    this.found(words[x].start, word.end);
                }

                //If the phrase/word is included and NOT excluded
                else if (this.included[phrase] === true && !(phrase in this.excluded))
                {
                    //Set phrase/word as 'bad'
                    this.addWordElem(this.caught, phrase, words[x].start, word.end);

                }

                //If this is NOT the last word
                if (y !== wordsLen-1)
                {
                    //Add a space to the phrase
                    phrase += ' ';
                }
            }
        }
    }

    /**
     * Checks every possible combination of chars in a given string
     * @param words: Array of strings
     * @param wordsLen: Length of the Array, or the size of the longest phrase
     */
    inWords(words, wordsLen)
    {
        let word;
        let wordLen;
        var phrase;

        if(wordsLen <= 0)
        {
            return;
        }

        //Check each word
        for(let i = 0; i < wordsLen; i++)
        {
            word = words[i].word;
            wordLen = word.length;
            //Check the first letter
            for(let j = 0; j < wordLen; j++)
            {
                phrase = '';
                //Check every j letter combination with k letters
                for(let k = j; k < wordLen; k++)
                {
                    phrase += word[k];
                    //If it is a forbidden word that can be found anywhere
                    if (this.included[phrase] === false)
                    {
                        this.addWordElem(this.caught, phrase, words[i].start + j, words[i].end);
                    }
                }
            }
        }
    }
}