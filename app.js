const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
const modeSelect = document.getElementById('modeSelect');
const colorPicker = document.getElementById('colorPicker');
const sizeSlider = document.getElementById('sizeSlider');
const sizeVal = document.getElementById('sizeVal');
const opacitySlider = document.getElementById('opacitySlider');
const fillCheck = document.getElementById('fillCheck');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const undoBtn = document.getElementById('undoBtn');

let isDrawing = false;
let startX, startY;
let snapshot;

// --- NEW: Object & History Management ---
let shapes = []; // Stores all movable shapes
let selectedShape = null;
let historyStack = []; 

function initCanvas() {
    canvas.width = window.innerWidth - 360; 
    canvas.height = window.innerHeight - 80;
    renderCanvas();
}

// THE BRAIN: This draws everything in order
function renderCanvas() {
    // 1. Clear with White background
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw all saved shapes from the array
    shapes.forEach(shape => {
        ctx.beginPath();
        ctx.globalAlpha = shape.opacity;
        ctx.lineWidth = shape.size;
        ctx.strokeStyle = shape.color;
        ctx.fillStyle = shape.color;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (shape.type === 'rect') {
            shape.fill ? ctx.fillRect(shape.x, shape.y, shape.w, shape.h) : ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
        } else if (shape.type === 'square') {
            shape.fill ? ctx.fillRect(shape.x, shape.y, shape.w, shape.h) : ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
        } else if (shape.type === 'circle') {
            ctx.arc(shape.x, shape.y, shape.r, 0, 2 * Math.PI);
            shape.fill ? ctx.fill() : ctx.stroke();
        } else if (shape.type === 'triangle') {
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.x2, shape.y2);
            ctx.lineTo(shape.x3, shape.y3);
            ctx.closePath();
            shape.fill ? ctx.fill() : ctx.stroke();
        } else if (shape.type === 'rightTriangle') {
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.x, shape.y2);
            ctx.lineTo(shape.x2, shape.y2);
            ctx.closePath();
            shape.fill ? ctx.fill() : ctx.stroke();
        } else if (shape.type === 'line') {
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.x2, shape.y2);
            ctx.stroke();
        }

        // Highlight selected object
        if (shape === selectedShape) {
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = "#ff00ff";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.setLineDash([]);
        }
    });
}

function isMouseInShape(x, y, shape) {
    if (shape.type === 'rect' || shape.type === 'square') {
        return x >= shape.x && x <= shape.x + shape.w && y >= shape.y && y <= shape.y + shape.h;
    } else if (shape.type === 'circle') {
        const dx = x - shape.x;
        const dy = y - shape.y;
        return (dx * dx + dy * dy) < shape.r * shape.r;
    }
    return false; // For complex shapes, selection is centered on start point
}

const startDraw = (e) => {
    startX = e.offsetX;
    startY = e.offsetY;

    if (modeSelect.value === 'select') {
        // Find if we clicked on an existing shape
        selectedShape = shapes.slice().reverse().find(s => isMouseInShape(startX, startY, s));
        renderCanvas();
        if (selectedShape) isDrawing = true; 
        return;
    }

    isDrawing = true;
    ctx.beginPath();
    ctx.lineWidth = sizeSlider.value;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = opacitySlider.value;
    
    ctx.strokeStyle = (modeSelect.value === 'eraser') ? "white" : colorPicker.value;
    ctx.fillStyle = colorPicker.value;
    ctx.moveTo(startX, startY);
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
    if (!isDrawing) return;
    const curX = e.offsetX;
    const curY = e.offsetY;

    if (modeSelect.value === 'select' && selectedShape) {
        const dx = curX - startX;
        const dy = curY - startY;
        selectedShape.x += dx;
        selectedShape.y += dy;
        // Also move secondary points for triangles/lines
        if(selectedShape.x2) { selectedShape.x2 += dx; selectedShape.y2 += dy; }
        if(selectedShape.x3) { selectedShape.x3 += dx; selectedShape.y3 += dy; }
        startX = curX;
        startY = curY;
        renderCanvas();
        return;
    }

    if (modeSelect.value !== 'brush' && modeSelect.value !== 'eraser') {
        ctx.putImageData(snapshot, 0, 0);
    }

    const isFilled = fillCheck.checked;
    if (modeSelect.value === 'brush' || modeSelect.value === 'eraser') {
        ctx.lineTo(curX, curY);
        ctx.stroke();
    } else if (modeSelect.value === 'rect') {
        isFilled ? ctx.fillRect(curX, curY, startX - curX, startY - curY) : ctx.strokeRect(curX, curY, startX - curX, startY - curY);
    } else if (modeSelect.value === 'square') {
        let side = Math.max(Math.abs(startX - curX), Math.abs(startY - curY));
        let nX = curX < startX ? startX - side : startX;
        let nY = curY < startY ? startY - side : startY;
        isFilled ? ctx.fillRect(nX, nY, side, side) : ctx.strokeRect(nX, nY, side, side);
    } else if (modeSelect.value === 'circle') {
        let radius = Math.sqrt(Math.pow(startX - curX, 2) + Math.pow(startY - curY, 2));
        ctx.beginPath(); ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        isFilled ? ctx.fill() : ctx.stroke();
    } else if (modeSelect.value === 'triangle') {
        ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(curX, curY); ctx.lineTo(startX * 2 - curX, curY); ctx.closePath();
        isFilled ? ctx.fill() : ctx.stroke();
    } else if (modeSelect.value === 'rightTriangle') {
        ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(startX, curY); ctx.lineTo(curX, curY); ctx.closePath();
        isFilled ? ctx.fill() : ctx.stroke();
    } else if (modeSelect.value === 'line') {
        ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(curX, curY); ctx.stroke();
    }
};

const stopDraw = (e) => {
    if (!isDrawing) return;
    const curX = e.offsetX;
    const curY = e.offsetY;

    if (modeSelect.value !== 'brush' && modeSelect.value !== 'eraser' && modeSelect.value !== 'select') {
        // Save the shape into our array
        const newShape = {
            type: modeSelect.value,
            x: startX, y: startY,
            color: colorPicker.value,
            size: sizeSlider.value,
            opacity: opacitySlider.value,
            fill: fillCheck.checked
        };

        if (modeSelect.value === 'rect') { newShape.w = curX - startX; newShape.h = curY - startY; }
        else if (modeSelect.value === 'square') { 
            let side = Math.max(Math.abs(startX - curX), Math.abs(startY - curY));
            newShape.x = curX < startX ? startX - side : startX;
            newShape.y = curY < startY ? startY - side : startY;
            newShape.w = newShape.h = side;
        }
        else if (modeSelect.value === 'circle') { newShape.r = Math.sqrt(Math.pow(startX - curX, 2) + Math.pow(startY - curY, 2)); }
        else if (modeSelect.value === 'triangle') { newShape.x2 = curX; newShape.y2 = curY; newShape.x3 = startX * 2 - curX; newShape.y3 = curY; }
        else if (modeSelect.value === 'rightTriangle') { newShape.y2 = curY; newShape.x2 = curX; }
        else if (modeSelect.value === 'line') { newShape.x2 = curX; newShape.y2 = curY; }

        shapes.push(newShape);
        renderCanvas();
    }
    isDrawing = false;
};

// Listeners
canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mouseup', stopDraw);

clearBtn.addEventListener('click', () => { shapes = []; renderCanvas(); });
undoBtn.addEventListener('click', () => { shapes.pop(); renderCanvas(); });

saveBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `DESIGNER_SERIES_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedShape) {
            shapes = shapes.filter(s => s !== selectedShape);
            selectedShape = null;
            renderCanvas();
        }
    }
});

sizeSlider.oninput = () => sizeVal.textContent = sizeSlider.value;
window.addEventListener('resize', initCanvas);
initCanvas();