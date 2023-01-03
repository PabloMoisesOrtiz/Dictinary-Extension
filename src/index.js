const BASE_URL = `https://api.dictionaryapi.dev/api/v2/entries/en`
const resultsBoard = document.getElementById('results');
const searchWord = document.getElementById('searchWord');

function createElement(tagName, options){
  return Object.assign(document.createElement(tagName), options);
}

function dataHandler(data){
    //Display main info about the given word
    const wordHeader = createElement('h1', {innerText:`${data[0]['word']}`})
    const wordType = createElement('p', {
      innerText:` ${data[0]['meanings'][0].partOfSpeech}`
    })
    const audioElement = createElement('audio', {
      controls:true,
      src:`${data[0]["phonetics"].find(element => element.audio).audio}`
    });

    resultsBoard.append(wordHeader, wordType, audioElement, createElement('hr'));

    //Diplay definitions and examples
    for (const element of data){
      element["meanings"][0]["definitions"].forEach(element => {
        const definitionHeader = createElement('h3', {innerText:`${element.definition}`});
        resultsBoard.append(definitionHeader);

        if (!element.example){
            resultsBoard.append(createElement('hr'));
            return
        }
  
        const listExamples = createElement('ul');
        const exampleItem = createElement('li', {innerText: `${element.example}`});
        listExamples.append(exampleItem);
        resultsBoard.append(listExamples, createElement('hr'));
      });
    }
}

function displayError(error){
    resultsBoard.append(error)
}

function fetchData(urlApi){
    fetch(urlApi)
    .then((response) => response.json())
    .then((data) => dataHandler(data))
    .catch((error) => displayError(error));
}

//main function
function initSearch(event){
  //prevent refreshing the page after every submit
    event.preventDefault();

    //empty the resultBoard in each word 
    resultsBoard.innerHTML = '';

    const word = document.getElementById('wordFeild').value;
    fetchData(`${BASE_URL}/${word}`);
}

searchWord.addEventListener('submit', initSearch);
