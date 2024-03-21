function addOptativa() {
    var optativaInput = document.getElementById("optativaInput");
    var optativasList = document.getElementById("optativasList");

    var optativa = document.createElement("li");
    optativa.textContent = optativaInput.value;
    optativasList.appendChild(optativa);

    optativaInput.value = "";
}

function updateHours(elementId, value) {
    document.getElementById(elementId).textContent = value;
}