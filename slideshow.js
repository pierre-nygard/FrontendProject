const slider = document.getElementById("slider");

function goNext() {
    alert("next");
}

function goBack() {
    alert("back");
}

function runApp() {
    loadSettings();
    addEventListeners();
}

function loadSettings() {
    let settingsurl = "/appsettings.json";

    fetch(settingsurl).
    then(response => response.json()).
    then(json =>  {
        for(var i = 0; i < json.image_count; i++) {
            let backLink = document.createElement('a');
            backLink.classList.add('go-back');
            backLink.innerHTML = 'Go back';
            backLink.addEventListener("click", goBack);

            let nextLink = document.createElement('a');
            nextLink.classList.add('go-to-next');
            nextLink.innerHTML = 'Go to next';
            nextLink.addEventListener("click", goNext);
            
            let image = document.createElement("div");
            image.classList.add('slider__image');
            image.dataset.image = i+1;
            image.appendChild(backLink);
            image.appendChild(nextLink);

            if(image.dataset.image == json.starting_image) 
                image.classList.add('slider__image--active');

            slider.appendChild(image);
        }
    });
}

document.onload = runApp();
