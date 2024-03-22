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
        const semestres = groupBySemestre(data);

        const container = document.querySelector('body');

        for (const semestre in semestres) {
            const h3 = createHeading('Semestre ' + semestre);
            container.appendChild(h3);

            const table = createTable(semestres[semestre]);
            container.appendChild(table);
        }

        addEventListeners();
        loadColors();
    });

function addOptativa() {
    const optativaInput = document.getElementById("optativaInput");
    const optativasList = document.getElementById("optativasList");

    const row = createOptativaRow(optativaInput.value);
    optativasList.appendChild(row);

    addOptativaToLocalStorage(optativaInput.value);

    optativaInput.value = "";
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

function deleteAllOptativas() {
    localStorage.removeItem('optativas');
    const optativasList = document.getElementById('optativasList');
    while (optativasList.rows.length > 1) {
        optativasList.deleteRow(1);
    }
}

function updateHours(elementId, value) {
    if (value) {
        document.getElementById(elementId).textContent = value;
        localStorage.setItem(elementId, value);
    }
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

function groupBySemestre(data) {
    return data.reduce((groups, item) => {
        const semestre = item.semestre;
        if (!groups[semestre]) {
            groups[semestre] = [];
        }
        groups[semestre].push(item);
        return groups;
    }, {});
}

function getColorFromClass(className) {
    const colorMap = {
        'completed': 'green',
        'current': 'blue',
        'considering': 'orange',
        'not-taken': 'grey'
    };
    return colorMap[className];
}

function addOptativaToLocalStorage(optativa) {
    let optativas = JSON.parse(localStorage.getItem("optativas")) || [];
    optativas.push(optativa);
    localStorage.setItem("optativas", JSON.stringify(optativas));
}

function removeOptativaFromLocalStorage(optativa) {
    let optativas = JSON.parse(localStorage.getItem("optativas"));
    const index = optativas.indexOf(optativa);
    if (index > -1) {
        optativas.splice(index, 1);
    }
    localStorage.setItem("optativas", JSON.stringify(optativas));
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

function createRemoveButton(optativa, row) {
    const button = document.createElement("button");
    button.textContent = "Remover";
    button.addEventListener('click', function () {
        removeOptativaFromLocalStorage(optativa);
        row.parentNode.removeChild(row);
    });
    return button;
}

function createButtonRow(item) {
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

function createOptativaRow(optativa) {
    const row = document.createElement("tr");

    const cell1 = document.createElement("td");
    cell1.textContent = optativa;
    row.appendChild(cell1);

    const cell2 = document.createElement("td");
    const button = createRemoveButton(optativa, row);
    cell2.appendChild(button);
    row.appendChild(cell2);

    return row;
}

function createHeading(text) {
    const h3 = document.createElement('h3');
    h3.textContent = text;
    return h3;
}

function createTable(items) {
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    const rows = items.map(createButtonRow).join('');
    tbody.innerHTML = rows;

    return table;
}

function handleButtonClick(event) {
    const materiaCell = event.target.parentElement.previousElementSibling;
    const color = getColorFromClass(event.target.className);
    materiaCell.style.color = color;
    localStorage.setItem(materiaCell.textContent, color);
}

function handleButtonConfirmModal() {
    deleteAllOptativas();
    document.getElementById('confirmModal').style.display = 'none';
}

function handleButtonCancelModal() {
    document.getElementById('confirmModal').style.display = 'none';
}

function handleButtonDeleteAllOptativas() {
    document.getElementById('confirmModal').style.display = 'block';
}