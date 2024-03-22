window.onload = function () {
    loadOptativas();

    var hoursIds = ['optativasHours', 'obrigatoriasHours', 'atividadesComplementaresHours'];

    for (var i = 0; i < hoursIds.length; i++) {
        var hoursId = hoursIds[i];
        var hoursValue = localStorage.getItem(hoursId);
        if (hoursValue) {
            document.getElementById(hoursId).textContent = hoursValue;
        }
    }
}

fetch('obs.json')
    .then(response => response.json())
    .then(data => {
        var semestres = data.reduce((groups, item) => {
            var semestre = item.semestre;
            if (!groups[semestre]) {
                groups[semestre] = [];
            }
            groups[semestre].push(item);
            return groups;
        }, {});

        var container = document.querySelector('body');

        for (var semestre in semestres) {
            var h3 = document.createElement('h3');
            h3.textContent = 'Semestre ' + semestre;
            container.appendChild(h3);

            var table = document.createElement('table');
            var tbody = document.createElement('tbody');
            table.appendChild(tbody);

            var rows = semestres[semestre].map(createRow).join('');
            tbody.innerHTML = rows;

            container.appendChild(table);
        }

        addEventListeners();
        loadColors();
    });

function createRow(item) {
    return `
        <tr>
            <td>${item.codigo} - ${item.nome}</td>
            <td>
                <button class="completed">Completed</button>
                <button class="current">Current</button>
                <button class="considering">Considering</button>
                <button class="not-taken">Not Taken</button>
            </td>
        </tr>
    `;
}

function addEventListeners() {
    const colorMap = {
        'completed': 'green',
        'current': 'blue',
        'considering': 'orange',
        'not-taken': 'grey'
    };

    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', event => {
            const materiaCell = event.target.parentElement.previousElementSibling;
            const color = colorMap[event.target.className];
            materiaCell.style.color = color;
            localStorage.setItem(materiaCell.textContent, color);
        });
    });

}

function addOptativa() {
    const optativaInput = document.getElementById("optativaInput");
    const optativasList = document.getElementById("optativasList");
    const row = document.createElement("tr");

    const cell1 = document.createElement("td");
    cell1.textContent = optativaInput.value;
    row.appendChild(cell1);

    const cell2 = document.createElement("td");
    const button = document.createElement("button");
    button.textContent = "Remover";
    button.addEventListener('click', function () {
        const optativas = JSON.parse(localStorage.getItem("optativas"));
        const index = optativas.indexOf(optativaInput.value);
        if (index > -1) {
            optativas.splice(index, 1);
        }
        localStorage.setItem("optativas", JSON.stringify(optativas));
        row.parentNode.removeChild(row);
    });
    cell2.appendChild(button);
    row.appendChild(cell2);

    optativasList.appendChild(row);

    let optativas = JSON.parse(localStorage.getItem("optativas"));

    if (!optativas) {
        optativas = [];
    }

    optativas.push(optativaInput.value);
    localStorage.setItem("optativas", JSON.stringify(optativas));

    optativaInput.value = "";
}

function updateHours(elementId, value) {
    if (value) {
        document.getElementById(elementId).textContent = value;
        localStorage.setItem(elementId, value);
    }
}

function loadOptativas() {
    const optativasList = document.getElementById("optativasList");
    let optativas = JSON.parse(localStorage.getItem("optativas"));

    if (!optativas) {
        optativas = [];
    } else {
        for (let i = 0; i < optativas.length; i++) {
            const row = document.createElement("tr");

            const cell1 = document.createElement("td");
            cell1.textContent = optativas[i];
            row.appendChild(cell1);

            const cell2 = document.createElement("td");
            const button = createRemoveButton(optativas[i], row);
            cell2.appendChild(button);
            row.appendChild(cell2);

            optativasList.appendChild(row);
        }
    }
}

function createRemoveButton(optativa, row) {
    const button = document.createElement("button");
    button.textContent = "Remover";
    button.addEventListener('click', function() {
        removeOptativaFromLocalStorage(optativa);
        removeRowFromTable(row);
    });
    return button;
}

function removeOptativaFromLocalStorage(optativa) {
    let optativas = JSON.parse(localStorage.getItem("optativas"));
    const index = optativas.indexOf(optativa);
    if (index > -1) {
        optativas.splice(index, 1);
    }
    localStorage.setItem("optativas", JSON.stringify(optativas));
}

function removeRowFromTable(row) {
    row.parentNode.removeChild(row);
}

function loadColors() {
    var materiaCells = document.querySelectorAll('td:first-child');

    for (var i = 0; i < materiaCells.length; i++) {
        var color = localStorage.getItem(materiaCells[i].textContent);

        if (color) {
            materiaCells[i].style.color = color;
        }
    }
}

function clearCellsColor() {
    var materiaCells = document.querySelectorAll('td:first-child');
    for (var i = 0; i < materiaCells.length; i++) {
        materiaCells[i].style.color = '';
        localStorage.removeItem(materiaCells[i].textContent);
    }
}

document.getElementById('deleteAllButton').addEventListener('click', function () {
    document.getElementById('confirmModal').style.display = 'block';
});

document.getElementById('confirmButton').addEventListener('click', function () {
    deleteAllOptativas();
    document.getElementById('confirmModal').style.display = 'none';
});

document.getElementById('cancelButton').addEventListener('click', function () {
    document.getElementById('confirmModal').style.display = 'none';
});

function deleteAllOptativas() {
    localStorage.removeItem('optativas');
    const optativasList = document.getElementById('optativasList');
    while (optativasList.rows.length > 1) {
        optativasList.deleteRow(1);
    }
}