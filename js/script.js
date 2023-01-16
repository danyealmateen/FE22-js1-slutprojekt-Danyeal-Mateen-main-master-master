//Här är alla globala divvar som behövs nås från flera platser.
let divForThePictures = document.getElementById("divForThePictures");
let animeParagraph = document.getElementById("animeParagraph");
let button = document.getElementById("button");
let randomButton = document.getElementById("randomButton");
let errorContainer = document.getElementById("errorMessageContainer");
let boxContainer = document.getElementById("boxContainer");
let animeDiv = document.getElementById("animeDiv");

//Ett event som lyssnar på ett knapptryck och exekverar olika funktioner.
button.addEventListener("click", (e) => {
  errorContainer.innerHTML = "";
  clearTheDivForPictures();
  e.preventDefault();
  renderFlickrPic();
  anime();
});

function renderFlickrPic() {
  let inputText = document.getElementById("inputText").value;
  let inputNumber = document.getElementById("inputNumber").value;
  let inputSorting = document.getElementById("inputSorting").value;
  let inputSortingValue = "";

  //Kollar om error är falsk för returnen längre ner.
  let isError = false;

  let radioButtonSmall = document.getElementById("radioButtonSmall");
  let radioButtonMedium = document.getElementById("radioButtonMedium");
  let radioButtonLarge = document.getElementById("radioButtonLarge");
  let radioButtonValue = "";

  //If sats som kontrollerar om radioknapparna är ibockade och skickar rätt värde (m,z,b) som motsvarar olika storleker på bilderna till den tomma variabeln checkboxValue som ersätter värdena i URL länken nedanför.
  if (radioButtonSmall.checked) {
    console.log("small checkad");
    radioButtonValue = "m";
  } else if (radioButtonMedium.checked) {
    console.log("medium checked");
    radioButtonValue = "z";
  } else if (radioButtonLarge.checked) {
    radioButtonValue = "b";
  } else {
    let createCheckboxErrorMessage = document.createElement("h1");
    createCheckboxErrorMessage.innerHTML = `<li>Please choose a img size!</li>`;
    errorContainer.appendChild(createCheckboxErrorMessage);
    isError = true;
  }

  //Hanterar errormeddelanden
  if (inputText === "") {
    let createErrorMessage = document.createElement("h1");
    createErrorMessage.innerHTML = `<li>Please fill in the "Search..." input!</li>`;
    errorContainer.appendChild(createErrorMessage);
    isError = true;
  }

  //If sats som konceptmässigt gör samma sak som ovan fast med sorteringsfälten.
  if (inputSorting === "Date posted") {
    inputSortingValue = "date-posted-asc";
    console.log(inputSortingValue);
  } else if (inputSorting === "Interestingness") {
    inputSortingValue = "interestingness-asc";
    console.log(inputSortingValue);
  } else if (inputSorting === "Relevance") {
    inputSortingValue = "relevance";
    console.log(inputSortingValue);
  }

  //Animationen som kallas när man klickar på knappen.
  animeDiv.style.visibility = "visible";
  const animation = anime({
    targets: "#animeDiv",
    color: "white",
    translateX: 5,
    translateY: 5,
    backgroundColor: "hsl(330, 100%, 71%)",
    border: "dotted 10px orange",
    duration: 1000,
    easing: "linear",
    direction: "alternate",
  });

  //Extra funktionalitet. Scrollar fram bilderna beroende på windows.height.
  function checkBoxes() {
    const boxes = document.querySelectorAll(".box");
    const triggerBottom = (window.innerHeight / 5) * 4;

    boxes.forEach((box) => {
      const boxTop = box.getBoundingClientRect().top;

      if (boxTop < triggerBottom) {
        box.classList.add("show");
      } else {
        box.classList.remove("show");
      }
    });
  }

  let url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=53e8d7af0f521f892d0883605d2e7213&text=${inputText}&per_page=${inputNumber}&sort=${inputSortingValue}&format=json&nojsoncallback=1 `;
  //Om isError är true så ska den inte fetcha någonting utan avsluta skriptet.
  if (isError) {
    let errorForNotFetchingAPI = document.createElement("h1");
    errorForNotFetchingAPI.innerHTML = `API adress doesnt work.`;
    document.body.appendChild(errorForNotFetchingAPI);
    return;
  }
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      animeDiv.style.visibility = "hidden";

      //Om man inte har ett giltigt sökord.
      if (data.photos.pages === 0) {
        errorContainer.innerHTML = `OBS! Inget giltigt sökord!`;
      }
      console.log(data.photos.pages);
      let firstImg = true;

      data.photos.photo.forEach((obj) => {
        let scrollBoxDiv = document.createElement("img");
        if (firstImg) {
          firstImg = false;
          scrollBoxDiv.setAttribute("class", "firstBox");
        } else {
          scrollBoxDiv.setAttribute("class", "box");
        }
        // scrollBoxDiv.setAttribute("class", "box");
        scrollBoxDiv.setAttribute(
          "src",
          `https://live.staticflickr.com/${obj.server}/${obj.id}_${obj.secret}_${radioButtonValue}.jpg`
        );
        boxContainer.appendChild(scrollBoxDiv);
      });
      window.addEventListener("scroll", checkBoxes);
    })

    //Fångar upp error meddelanden och loggar det i konsolen samt ett meddelande skrivs ut till DOM:en.
    .catch((error) => {
      console.log(error);
    });
}
function clearTheDivForPictures() {
  //Rensar innehållet av divven.
  boxContainer.innerHTML = "";
}

let downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", (e) => {
  e.preventDefault();
  downloadURL();
});

//Extra funktionalitet.
function downloadURL() {
  let link = document.createElement("a");
  link.download = "Thanks for using my APP!.txt";
  link.href = "data:text/html,THANK YOU SO MUCH FOR USING MY APP";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}
