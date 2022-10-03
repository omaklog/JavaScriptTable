let totalSum = 0;
let dimension = 0;
let sumRow = 0;
let sumCol = 0;
let timer = 0;
let dataTable = null;
let rowsAndCols = []
let selected = {
    row: null,
    col: null,
}
const labelSumRow = document.getElementById('rowSum');
const labelSumCol = document.getElementById('colSum');
const labelSumTotal = document.getElementById('totalSum');
const style = document.createElement("style");

hideButtonsFigure();

function fillTable(size) {
    const table = new Array(size);
    for (let row = 0; row < size; row++) {
        table[row] = new Array(size)
        for (let col = 0; col < size; col++) {
            table[row][col] = getRandomNumber()
        }
    }
    return table
}

function generateTable() {
    showButtonsFigure();
    hideGenerateElements();
    clearTable();
    totalSum = 0;
    dimension = Number(document.getElementById('dimension').value);
    dataTable = fillTable(dimension)
    console.log("dataTable", dataTable)
    let body = document.getElementsByClassName('tabla')[0];
    let table = document.createElement('table');
    let tblBody = document.createElement('tbody');
    //recorro las filas, recibo los valores de la fila y el numero de fila
    dataTable.forEach(function (rowElements, row) {
        tblBody.appendChild(createRowNode(rowElements, row));
    })
    table.appendChild(tblBody);
    body.appendChild(table);
    table.setAttribute('border', '2');
}

function clearTable() {
    let tables = document.getElementsByTagName('table');
    if (tables.length) tables[0].remove();
}

function createRowNode(rowElements, row) {
    let rowNode = document.createElement('tr');
    //recorro los elementos de la fila, recibo el valor y el numero de columna
    rowElements.forEach(function (value, col) {
        timer += 125;
        setTimeout(function () {
            rowNode.appendChild(createCell(row, col, value));
        }, timer)
        //console.log(`Fila : ${row} Col: ${col} valor: ${value}` )
    })
    return rowNode;
}


function createCell(row, col, value) {
    let cell = document.createElement('td');
    cell.setAttribute('row', row);
    cell.setAttribute('col', col);
    cell.setAttribute('class', `row-${row} col-${col} fadeIn`);
    cell.setAttribute('id', `item-${row}${col}`)
    cell.textContent = value;
    //se agrega el evento click para que se ejecute la funcion anonima y a su vez
    //llame a la funcion getResults y le envia los parametros necesarios de la celda donde se hizo click
    cell.addEventListener('click', function (value) {
        getResults(value, row, col);
        selected.row = row;
        selected.col = col;
    });
    return cell;
}


function getRandomNumber() {
    return Math.floor(Math.random() * ( 10 - 1 ) + 1);
}

function clearValues() {
    sumRow = 0;
    sumCol = 0;
}


function getResults(value, row, col) {
    removeEffect()
    setStyles(row, col);
    clearValues();
}

function setStyles(row = '', col = '') {
    style.textContent = `#item-${row}${col} {
        background-color: green;
        color: white;
    }`
    document.head.appendChild(style)
}

function sumarFila(row) {
    rowsAndCols = []
    let sum = 0;
    dataTable[row].forEach(function (value, index) {
        rowsAndCols.push(`#item-${row}${index}`)
        sum += value;
    })
    addStyleAndEffect()
    return sum;
}

function sumarColumna(col) {
    rowsAndCols = []
    let sum = 0;
    dataTable.forEach(function (values, index) {
        rowsAndCols.push(`#item-${index}${col}`)
        sum += values[col];
    })
    addStyleAndEffect()
    return sum;
}

function sumarEspiral({ row, col }) {
    rowsAndCols = []
    let sum = 0
    if (( col + 1 ) === dimension) return dataTable[row][col]
    sum += sumToRight(row, col)
    //console.log('PARTIAL 1', sum)
    if (row === 0) return sum
    sum += sumToTop(row - 1, dimension - 1)
    // console.log('PARTIAL 2', sumToTop(row - 1, dimension - 1))
    sum += sumToLeft()
    //console.log('PARTIAL 3', sumToLeft())
    if (col === 0) return sum
    sum += sumToBottom()
    //console.log('PARTIAL 4', sumToBottom(row))
    if (( row + 1 ) === dimension) return sum
    sum += sumToRight(dimension - 1, 1)
    //console.log('PARTIAL 5', sumToRight(dimension - 1, 1))
    sum += sumToReturnTop(row, dimension - 1)
    //console.log('PARTIAL 6', sumToReturnTop(row, dimension - 1))
    addStyleAndEffect()
    return sum
}

function sumToRight(row, col) {
    let sum = 0;
    for (let currentCol = col; currentCol < dimension; currentCol++) {
        sum += dataTable[row][currentCol]
        rowsAndCols.push(`#item-${row}${currentCol}`)
    }
    return sum
}

function sumToTop(row, col) {
    let sum = 0;
    for (let currentRow = row; currentRow >= 0; currentRow--) {
        sum += dataTable[currentRow][col]
        rowsAndCols.push(`#item-${currentRow}${col}`)
        console.log(`#item-${currentRow}${col}`)
    }
    return sum
}

function sumToLeft() {
    let sum = 0;
    for (let currentCol = dimension - 2; currentCol >= 0; currentCol--) {
        sum += dataTable[0][currentCol]
        rowsAndCols.push(`#item-${0}${currentCol}`)
    }
    return sum
}

function sumToBottom() {
    let sum = 0;
    for (let currentRow = 1; currentRow < dimension; currentRow++) {
        sum += dataTable[currentRow][0]
        rowsAndCols.push(`#item-${currentRow}${0}`)
    }
    return sum
}

function sumToReturnTop(row, col) {
    let sum = 0;
    for (let currentRow = dimension - 2; currentRow >= 0; currentRow--) {
        if (currentRow === row) {
            break;
        }
        sum += dataTable[currentRow][col]
        rowsAndCols.push(`#item-${currentRow}${col}`)
    }
    return sum
}


function getHorizontal() {
    labelSumRow.textContent = `Suma de fila: ${sumarFila(selected.row)}`;
}

function getVertical() {
    labelSumCol.textContent = `Suma de columna: ${sumarColumna(selected.col)}`;

}

function getEspiral() {
    labelSumTotal.textContent = `Suma total: ${sumarEspiral(selected)}`;
}

function hideButtonsFigure() {
    const btnHotizontal = document.getElementById('btn-horizontal');
    const btnVertical = document.getElementById('btn-vertical');
    const btnEspiral = document.getElementById('btn-espiral');
    const btnReset = document.getElementById('btn-reset');
    btnHotizontal.style.display = 'none'
    btnVertical.style.display = 'none'
    btnEspiral.style.display = 'none'
    btnReset.style.display = 'none'
}

function showButtonsFigure() {
    const btnHotizontal = document.getElementById('btn-horizontal');
    const btnVertical = document.getElementById('btn-vertical');
    const btnEspiral = document.getElementById('btn-espiral');
    const btnReset = document.getElementById('btn-reset');
    btnHotizontal.style.display = 'block'
    btnVertical.style.display = 'block'
    btnEspiral.style.display = 'block'
    btnReset.style.display = 'block'
}

function hideGenerateElements() {
    const button = document.getElementById('generate-elements')
    button.style.display = 'none';
}

function showGenerateElements() {
    const button = document.getElementById('generate-elements')
    button.style.display = 'block';
}


function addStyleAndEffect() {
    removeEffect()
    timer=0;
    rowsAndCols.forEach(function (element) {
        timer +=125;
        setTimeout(function(){
            addEffect(element);
        }, timer);
    })
}

function removeEffect() {
    dataTable.forEach(function (rowElements, row) {
        rowElements.forEach(function (value, col) {
            let cell = document.getElementById(`item-${row}${col}`)
            cell.className = cell.className.replace('fadeIn', '')
            cell.className = cell.className.replace('spiralClass', '')
            console.log(cell.classList)
            console.log(cell.className)
        })
    })
}

function addEffect(id){
    id= id.replace('#', '')
    let cell = document.getElementById(id)
    cell.className+= ' fadeIn spiralClass'
}
