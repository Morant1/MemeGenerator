'use strict';
var gCanvas;
var gCtx;
var gCurrId;
var gCountInput;


function onInit() {
    renderImgs()

}

function renderImgs() {
    var imgs = createImgs();

    var strHtmls = imgs.map(function (img) {
        return `
     <div class="img img-${img.id}" onclick="onImgClicked(${img.id})"><img src="${img.url}"></div>
        `
    });

    document.querySelector('.grid-image-container').innerHTML = strHtmls.join('')

}

function onImgClicked(id) {
    gCurrId = id;
    setMemeID(id);
    openMemeModal()
}



function openMemeModal() {
    document.querySelector('.modal-meme').style.visibility = 'visible';
    gCanvas = document.getElementById('myCanvas');
    gCtx = gCanvas.getContext('2d');

    loadImg();

}

function loadImg() {
    const img = new Image();
    img.src = `square-imgs/${gCurrId}.jpg`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        drawText();
    }
}

function drawText() {
    var meme = getMeme();
    if (!meme.lines[meme.selectedLineIdx].txt) {
        var text = document.querySelector('.text-input').value;
        if (!text) return;
        setMemeText(text);

    }
    for (var i = 0; i < meme.lines.length; i++) {
        gCtx.lineWidth = '2';
        gCtx.strokeStyle = 'black';
        gCtx.fillStyle = `${meme.lines[i].color}`;
        gCtx.font = `${meme.lines[i].size}px Impact`;
        gCtx.textAlign = `${meme.lines[i].align}`;
        gCtx.fillText(meme.lines[i].txt, meme.lines[i].x, meme.lines[i].y);
        gCtx.strokeText(meme.lines[i].txt, meme.lines[i].x, meme.lines[i].y);

    }
}


// var currLine = meme.selectedLineIdx;
// gCtx.lineWidth = '2';
// gCtx.strokeStyle = 'black';
// gCtx.fillStyle = `${meme.lines[currLine].color}`;
// gCtx.font = `${meme.lines[currLine].size}px Impact`;
// gCtx.textAlign = `${meme.lines[currLine].align}`;
// gCtx.fillText(text, meme.lines[currLine].x, meme.lines[currLine].y);
// gCtx.strokeText(text, meme.lines[currLine].x, meme.lines[currLine].y);



// control canvas

function onSwitchLines() {
    var meme = getMeme();
    var coordX = meme.lines[meme.selectedLineIdx].x;
    var coordY = meme.lines[meme.selectedLineIdx].y;

        gCtx.beginPath();
        gCtx.moveTo(coordX-10, coordY+10);
        gCtx.lineTo(coordX+80,coordY+10);
        gCtx.strokeStyle = 'yellow';
        gCtx.stroke();
        
    getCurrIdx();

}

function onAddText() {
    setMineLine();
    drawText();

}

function onIncreaseFont() {
    setMemeSize();
    loadImg()
}

function onDecreaseFont() {
    setMemeSize(true);
    loadImg();
}

function onDeleteText() {
    var meme = getMeme();
    if (meme.selectedLineIdx !== 0) {
        deleteMemeList()
        loadImg();
    } else {
        document.querySelector('.text-input').value = '';
        setMemeText('');
        loadImg();
    }

}

function onChangeTextColor() {
    setMimeColor()
    loadImg()
}

function onTextalign(direction) {
    setMimeDirection(direction)
    loadImg()
}

function downloadCanvas(elLink) {
    const data = gCanvas.toDataURL();
    // console.log(data); /// show base64 string
    elLink.href = data;
    elLink.download = 'my-image.jpg';
}







// function clearCanvas() {
//     gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
//     // You may clear part of the canvas
//     // gCtx.clearRect(0, 0, gCanvas.width / 2, gCanvas.height / 2);
// }













function clickCanvas(ev) {
    console.log(ev.offsetX, ev.offsetY)
}
// function openGallery() {

// }