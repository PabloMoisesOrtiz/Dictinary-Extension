const BASE_URL = `https://api.dictionaryapi.dev/api/v2/entries/en`
const resultsBoard = document.getElementById('results');
const searchWord = document.getElementById('searchWord');

function createElement(tagName, options){
  return Object.assign(document.createElement(tagName), options);
}

function displayMainInfo(data){
  //Display main info about the given word
  const wordHeader = createElement('h1', {innerText:`${data[0]['word']}`})
  const wordType = createElement('p', {
    innerText:` ${data[0]['meanings'][0].partOfSpeech}`
  })
  const audioElement = createElement('audio', {
    controls:true,
    src:`${data[0]["phonetics"].find(element => element?.audio)?.audio}`
  });

  resultsBoard.append(wordHeader, wordType, audioElement, createElement('hr'));
}

function displayDefinitions(data) {
  for (const element of data) {
    element.meanings.forEach((meaning) => {
      meaning.definitions.forEach((definition) => {
        displayDefinition(definition);
      });
    });
  }
}

function displayDefinition(definition) {
  const definitionHeader = createElement('h3', {innerText: `${definition.definition}`});
  resultsBoard.append(definitionHeader);

  if (!definition.example) {
      resultsBoard.append(createElement('hr'));
      return;
  }

  const listExamples = createElement('ul');
  displayExample(definition.example, listExamples);
  resultsBoard.append(listExamples, createElement('hr'));
}

function displayExample(example, list) {
  const exampleItem = createElement('li', {innerText: `${example}`});
  list.append(exampleItem);
}

function dataHandler(data){
    try {
      displayMainInfo(data)
      displayDefinitions(data)
    } catch (error) {
      console.log(error)
    }
}

function displayError(error){
    resultsBoard.append(error);
}

async function fetchData(urlApi) {
  try {
    const response = await fetch(urlApi);
    const data = await response.json();

    if (!response.ok){
      throw new Error("Invalid WORD or Networking error!");
    }
    dataHandler(data);
  } catch (error) {
    displayError(error);
  }
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
