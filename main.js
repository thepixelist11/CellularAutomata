// ------------ Presets
const presets = {
  'plus-grid': '768:0,1:1,3:0,1:1,3:0,1:1,40:0,3:1,1:0,3:1,1:0,3:1,40:0,1:1,3:0,1:1,3:0,1:1,91:0,1:1,3:0,1:1,3:0,1:1,40:0,3:1,1:0,3:1,1:0,3:1,40:0,1:1,3:0,1:1,3:0,1:1,91:0,1:1,3:0,1:1,3:0,1:1,40:0,3:1,1:0,3:1,1:0,3:1,40:0,1:1,3:0,1:1,3:0,1:1,1223:0,',
}

// ------------ Utils
function lerp(A, B, t) {
  return A + (B - A) * t;
}

function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}

function polysIntersection(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(poly1[i], poly1[(i + 1) % poly1.length], poly2[j], poly2[(j + 1) % poly2.length]);
      if (touch) {
        return true;
      }
    }
  }
  return false;
}

function getRGBA(value) {
  const alpha = Math.abs(value);
  const R = value < 0 ? 0 : 255;
  const G = R;
  const B = value > 0 ? 0 : 255;
  return 'rgba(' + R + ',' + G + ',' + B + ',' + alpha + ')';
}

function swap(arr, firstIndex, secondIndex) {
  var temp = arr[firstIndex];
  arr[firstIndex] = arr[secondIndex];
  arr[secondIndex] = temp;
}
function sort(arraytest) {
  var len = arraytest.length,
    i,
    j,
    stop;
  for (i = 0; i < len; i++) {
    for (j = 0, stop = len - i; j < stop; j++) {
      if (arraytest[j] > arraytest[j + 1]) {
        swap(arraytest, j, j + 1);
      }
    }
  }
  return arraytest;
}

class col {
  constructor(r, g, b, a = 255) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
}
class aARect{
  constructor(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.update()
  }

  update(){
    this.points = [
      [this.x, this.y],
      [this.x + this.width, this.y],
      [this.x + this.width, this.y + this.height],
      [this.x, this.y + this.height],
    ]
  }
}

function drawPoint(x, y, radius, ctx, color = new col(0, 0, 0)) {
  ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b}, ${color.a})`
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawLine(x1, y1, x2, y2, width, ctx, color = new col(0, 0, 0)){
  ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b}, ${color.a})`
  ctx.lineWidth = width
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawPoly(points, ctx, borderWidth, color = new col(0, 0, 0), filled = false, fillCol = new col(0, 0, 0)){
  if(!filled){
    //Draw the edges of the polygon
    for(let i = 0; i < points.length - 1; i++){
      drawLine(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], borderWidth, ctx, color)
    }
    drawLine(points[points.length - 1][0], points[points.length - 1][1], points[0][0], points[0][1], borderWidth, ctx, color)
  } else {
    ctx.lineWidth = borderWidth
    ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b}, ${color.a})`
    ctx.fillStyle = `rgb(${fillCol.r}, ${fillCol.g}, ${fillCol.b}, ${fillCol.a})`
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    //Add verticies
    for(let i = 1; i < points.length; i++){
      ctx.lineTo(points[i][0], points[i][1])
    }
    ctx.lineTo(points[0][0], points[0][1])
    ctx.fill();
  }
}

function deg2rad(x){
  return x * Math.PI / 180
}

function rad2deg(x){
  return x * 180 / Math.PI
}

function index2coords(index, width){
  return {
    x: index % width,
    y: Math.floor(index / width - 1) + 1
  }
}

function coords2index(x, y, width){
  return x + (y * width)
}

// -------------- General Functions
function drawGridLines(){
  for(let i = 0; i < gridWidth; i++){
    for(let j = 0; j < gridHeight; j++){
      drawLine(
        lerp(0, canvas.width, i / gridWidth), 
        lerp(0, canvas.height, j / gridHeight), 
        lerp(0, canvas.width, i / gridWidth), 
        lerp(canvas.height, 0, j / gridHeight),
        2,
        ctx,
        new col(200, 200, 200)
      )
    }
  }
  for(let i = 0; i < gridWidth; i++){
    for(let j = 0; j < gridHeight; j++){
      drawLine(
        lerp(0, canvas.width, i / gridWidth), 
        lerp(0, canvas.height, j / gridHeight), 
        lerp(canvas.width, 0, i / gridWidth), 
        lerp(0, canvas.height, j / gridHeight),
        2,
        ctx,
        new col(200, 200, 200)
      )
    }
  }
}

function fillCells(){
  for(let i = 0; i < gridWidth; i++){
    for(let j = 0; j < gridHeight; j++){
      if(grid[coords2index(i, j, gridWidth)] == 1){
        drawPoly([
          [lerp(0, canvas.width, i / gridWidth), lerp(0, canvas.height, j / gridHeight)],
          [lerp(0, canvas.width, (i+1) / gridWidth), lerp(0, canvas.height, j / gridHeight)],
          [lerp(0, canvas.width, (i+1) / gridWidth), lerp(0, canvas.height, (j+1) / gridHeight)],
          [lerp(0, canvas.width, i / gridWidth), lerp(0, canvas.height, (j+1) / gridHeight)],
        ], ctx, 0, new col(0, 0, 0), true, new col(0, 0, 0))
      }
    }
  }
}

function getNumberOfNeighbours(){
  let nCount = []
  for(let i = 0; i < grid.length; i++){
    let val = 0
    if(grid[coords2index(index2coords(i, gridWidth).x + 0, index2coords(i, gridWidth).y + 1, gridWidth)] == 1 && !(index2coords(i, gridWidth).x + 0 < 0) && !(index2coords(i, gridWidth).x + 0 > gridWidth - 1) && !(index2coords(i, gridWidth).y + 1 < 0) && !(index2coords(i, gridWidth).y + 1 > gridHeight - 1)){val++}
    if(grid[coords2index(index2coords(i, gridWidth).x + 1, index2coords(i, gridWidth).y + 1, gridWidth)] == 1 && !(index2coords(i, gridWidth).x + 1 < 0) && !(index2coords(i, gridWidth).x + 1 > gridWidth - 1) && !(index2coords(i, gridWidth).y + 1 < 0) && !(index2coords(i, gridWidth).y + 1 > gridHeight - 1)){val++}
    if(grid[coords2index(index2coords(i, gridWidth).x + 1, index2coords(i, gridWidth).y + 0, gridWidth)] == 1 && !(index2coords(i, gridWidth).x + 1 < 0) && !(index2coords(i, gridWidth).x + 1 > gridWidth - 1) && !(index2coords(i, gridWidth).y + 0 < 0) && !(index2coords(i, gridWidth).y + 0 > gridHeight - 1)){val++}
    if(grid[coords2index(index2coords(i, gridWidth).x + 1, index2coords(i, gridWidth).y + -1, gridWidth)] == 1 && !(index2coords(i, gridWidth).x + 1 < 0) && !(index2coords(i, gridWidth).x + 1 > gridWidth - 1) && !(index2coords(i, gridWidth).y - 1 < 0) && !(index2coords(i, gridWidth).y - 1 > gridHeight - 1)){val++}
    if(grid[coords2index(index2coords(i, gridWidth).x + 0, index2coords(i, gridWidth).y + -1, gridWidth)] == 1 && !(index2coords(i, gridWidth).x + 0 < 0) && !(index2coords(i, gridWidth).x + 0 > gridWidth - 1) && !(index2coords(i, gridWidth).y -1 < 0) && !(index2coords(i, gridWidth).y - 1 > gridHeight - 1)){val++}
    if(grid[coords2index(index2coords(i, gridWidth).x + -1, index2coords(i, gridWidth).y + -1, gridWidth)] == 1 && !(index2coords(i, gridWidth).x -1 < 0) && !(index2coords(i, gridWidth).x - 1 > gridWidth - 1) && !(index2coords(i, gridWidth).y - 1 < 0) && !(index2coords(i, gridWidth).y - 1 > gridHeight - 1)){val++}
    if(grid[coords2index(index2coords(i, gridWidth).x + -1, index2coords(i, gridWidth).y + 0, gridWidth)] == 1 && !(index2coords(i, gridWidth).x - 1 < 0) && !(index2coords(i, gridWidth).x - 1 > gridWidth - 1) && !(index2coords(i, gridWidth).y + 0 < 0) && !(index2coords(i, gridWidth).y + 0 > gridHeight - 1)){val++}
    if(grid[coords2index(index2coords(i, gridWidth).x + -1, index2coords(i, gridWidth).y + 1, gridWidth)] == 1 && !(index2coords(i, gridWidth).x - 1 < 0) && !(index2coords(i, gridWidth).x - 1 > gridWidth - 1) && !(index2coords(i, gridWidth).y + 1 < 0) && !(index2coords(i, gridWidth).y + 1 > gridHeight - 1)){val++}
    nCount.push(val)
  }
  return nCount
}

function randomizeGrid(){
  for(let i = 0; i < grid.length; i++){
    if(Math.random() >= 0.5){
      grid[i] = 1
    } else {
      grid[i] = 0
    }
  }
}

function updateCells(){
  const neighbours = getNumberOfNeighbours()
  for(let i = 0; i < grid.length; i++){
    const n = neighbours[i]
    if(grid[i] == 0){
      if(n == 3 || n == 6 || n == 7 || n == 8){
        grid[i] = 1
      }
    } else {
      if(n == 0 || n == 1 || n == 2 || n == 5){
        grid[i] = 0
      }
    }
  }
}

function initEventListeners(){
  document.onmousemove = evt => {
    const rect = canvas.getBoundingClientRect()

    mouseX = evt.clientX - rect.left
    mouseY = evt.clientY - rect.top
  }
  document.onmousedown = evt => {
    if(evt.button == 1){
      evt.preventDefault()
    }
  }
  document.oncontextmenu = evt => {
    evt.preventDefault()
  }
  canvas.onmousedown = evt => {
    if(evt.button == 0){
      const mousePos = snapToGridUnits(mouseX, mouseY, canvas.width / gridWidth, canvas.height / gridHeight)
      grid[coords2index(mousePos.x, mousePos.y, gridWidth)] = grid[coords2index(mousePos.x, mousePos.y, gridWidth)] == 0 ? 1 : 0
    }
  }
  document.onkeydown = evt => {
    if(evt.key == ' '){
      evt.preventDefault()
      if(state == 'setup'){
        saveGrid()
        state = 'sim'
        start = null
        simulate(0)
      } else if(state == 'sim') {
        startSetup()
      }
    }
  }
}

function startSetup(){
  state = 'setup'
  setup()
  setTimeout(() => {loadGrid(savedGrid)}, 100)
}

function snapToGridUnits(x, y, width, height){
  const retX = Math.floor(x / width)
  const retY = Math.floor(y / height)

  return {
    x: retX,
    y: retY
  }
}

function saveGrid(){
  savedGrid = [...grid]
}

function loadGrid(gridToLoad){
  grid = [...gridToLoad]
}

function fillHovered(){
  const mousePos = snapToGridUnits(mouseX, mouseY, canvas.width / gridWidth, canvas.height / gridHeight)
  if(mousePos.x < gridWidth && mousePos.x > -1 && mousePos.y < gridHeight && mousePos.y > -1)
  drawPoly([
    [lerp(0, canvas.width, mousePos.x / gridWidth), lerp(0, canvas.height, mousePos.y / gridHeight)],
    [lerp(0, canvas.width, (mousePos.x+1) / gridWidth), lerp(0, canvas.height, mousePos.y / gridHeight)],
    [lerp(0, canvas.width, (mousePos.x+1) / gridWidth), lerp(0, canvas.height, (mousePos.y+1) / gridHeight)],
    [lerp(0, canvas.width, mousePos.x / gridWidth), lerp(0, canvas.height, (mousePos.y+1) / gridHeight)],
  ], ctx, 3, new col(0, 0, 0), false)
}

function loadPreset(preset){
  if(presets[preset] == null){
    window.alert('Preset not found')
    return
  }
  loadGrid(expand(presets['plus-grid']).map(e => parseInt(e)))
}

function expand(s){
  let sets = s.split(',')
  let ret = []
  for(let i = 0; i < sets.length; i++){
    const quant = parseInt(sets[i].split(':')[0])
    const val = sets[i].split(':')[1]
    for(let j = 0; j < quant; j++){
      ret.push(val)
    }
  }
  return ret
}

function compress(a){
  let lastVal = null
  let currentQuant = 0
  let currentVal = null
  let ret = ''
  for(let i = 0; i < a.length; i++){
    if(i == 0){
      currentVal = a[0]
      currentQuant = 0
      lastVal = a[0]
    }
    if(a[i] != lastVal){
      ret = ret.concat(`${currentQuant}:${currentVal},`)
      currentVal = a[i]
      lastVal = a[i]
      currentQuant = 1
    } else {
      currentQuant++
    }
  }
  ret = ret.concat(`${currentQuant}:${currentVal},`)
  return ret
}
// -------------- Main
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const gridWidth = 50
const gridHeight = 50

const timeStep = 100

let grid = new Array(gridWidth * gridHeight).fill(0)

let mouseX = 0
let mouseY = 0

let state = 'setup'

let savedGrid = new Array(gridWidth * gridHeight).fill(0)

let timeSinceUpdate = 0
let deltaTime = 0
let lastTime = 0

let start = null

initEventListeners()
setup()

function simulate(realtime){
  if(!start){
    start = realtime
  }
  time = realtime - start

  deltaTime = time - lastTime
  lastTime = time
  timeSinceUpdate += parseInt(deltaTime)
  
  if(time > timeStep){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawGridLines()
    fillCells()
    updateCells()
    start = realtime
  }

  if(state == 'sim'){
    requestAnimationFrame(simulate)
  }
}

function setup(){
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  drawGridLines()
  fillCells()
  fillHovered()

  if(state == 'setup'){
    requestAnimationFrame(setup)
  }
}
