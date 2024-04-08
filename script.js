document.addEventListener('DOMContentLoaded', function() {
    const adjectiveDisplay = document.getElementById('adjectiveDisplay');
    const definitionDisplay = document.getElementById('definitionDisplay');
    const exampleDisplay = document.getElementById('exampleDisplay');
    const saveWordButton = document.getElementById('saveWordButton');
    const newWordButton = document.getElementById('newWordButton');
    const savedWordsList = document.getElementById('savedWordsList');

    fetchWordOfTheDay();

    newWordButton.addEventListener('click', fetchWordOfTheDay);

    async function fetchWordOfTheDay() {
        const randomWordUrl = 'https://wordsapiv1.p.rapidapi.com/words?random=true&partOfSpeech=adjective';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'da49bafff1msh409a0c9c944f837p1e86bcjsn52c91fccd641', // Replace with your API key
                'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
            }
        };

        try {
            const wordResponse = await fetch(randomWordUrl, options);
            const wordResult = await wordResponse.json();
            const word = wordResult.word;
            const definition = wordResult.results[0].definition;
            
            // Fetch an example for the word
            const exampleUrl = `https://wordsapiv1.p.rapidapi.com/words/${word}/examples`;
            const exampleResponse = await fetch(exampleUrl, options);
            const exampleResult = await exampleResponse.json();
            const example = exampleResult.examples && exampleResult.examples.length > 0 ? exampleResult.examples[0] : 'No example available.';

            adjectiveDisplay.textContent = `Word: ${word}`;
            definitionDisplay.textContent = `Definition: ${definition}`;
            exampleDisplay.textContent = `Example: ${example}`;
        } catch (error) {
            console.error('Failed to fetch word of the day or its example:', error);
        }
    }

    // The code for saving words and updating the saved words list remains the same.
    saveWordButton.addEventListener('click', () => {
        const word = adjectiveDisplay.textContent.replace('Word: ', '');
        const definition = definitionDisplay.textContent.replace('Definition: ', '');
        const example = exampleDisplay.textContent.replace('Example: ', '');
        saveWord(word, definition, example);
    });

    function saveWord(word, definition, example) {
        const savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];
        savedWords.push({ word, definition, example });
        localStorage.setItem('savedWords', JSON.stringify(savedWords));
        updateSavedWordsList();
    }

    function updateSavedWordsList() {
        const savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];
        savedWordsList.innerHTML = '';
        savedWords.forEach(wordObj => {
            const li = document.createElement('li');
            li.textContent = `${wordObj.word}: ${wordObj.definition}`;
            savedWordsList.appendChild(li);
        });
    }

    updateSavedWordsList();
});
