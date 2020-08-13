'use strict';
var gCanvas;
var gIsModalOpen = false;
var gCtx;
var gCurrId;
var gCountInput;
var gStickerNum;
const KEY = 'memes'

var gSavedCanvasAsImg;


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
    gIsModalOpen= true;
    document.querySelector('.hide-grid').style.display = 'none';
    gCanvas = document.getElementById('myCanvas');
    gCtx = gCanvas.getContext('2d');
    loadImg();
    resizeCanvas()
   

}


function onSaveToStorage() {
    saveToStorage(KEY, gCanvas.toDataURL());

}

function loadImg() {
    if (gIsModalOpen) {
    // 
    var meme = getMeme();
    setMimeCoorX(gCanvas.width)
    // 
    const img = new Image();
    img.src = `square-imgs/${gCurrId}.jpg`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        drawText();
    }
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


// CONTROL CANVAS BOX

function onDragSticker(num){
    gStickerNum = num; 
}

function onDropSticker(ev){
    const img = new Image();
    img.src = `./stickers/sticker${gStickerNum}.jpg`;
    img.onload = () => { 

     var w=(img.width)*4.5;
     var h=(img.height)*4.5;

    gCtx.drawImage(img, 0, 0, w,h,ev.offsetX, ev.offsetY, gCanvas.width, gCanvas.height);
    }
    

  
}

function onClickup(){
    changeTextPos(false);
    loadImg();
}

function onClickDown(){
    changeTextPos(true);
    loadImg();
}

    


function onSwitchLines() {
   
    var meme = getMeme();
    getCurrIdx()
    var coordX = meme.lines[meme.selectedLineIdx].x;
    var coordY = meme.lines[meme.selectedLineIdx].y;

        gCtx.beginPath();
        gCtx.moveTo(coordX-10, coordY+10);
        gCtx.lineTo(coordX+100,coordY+10);
        gCtx.strokeStyle = 'yellow';
        gCtx.lineWidth = 6;
        gCtx.stroke();
    console.log(meme.selectedLineIdx)
    setTimeout(loadImg,500);

}

function onSearch() {
    var searchInput = document.querySelector('.search-input').value;
    filterImages(searchInput);
    renderImgs();
}
function onAddText() {
    var widthCanvas = gCanvas.width;
    var heightCanvas = gCanvas.height;
    setMineLine(widthCanvas,heightCanvas);
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
    elLink.href = data;
    elLink.download = 'my-image.jpg';
}




function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}


function closeModal() {
    document.querySelector('.hide-grid').style.display = 'block';
    document.querySelector('.modal-meme').style.visibility = 'hidden';
    document.querySelector('.sub-navbar').classList.remove('open-hamb');
    gIsModalOpen= false;

    resetLines();
    document.querySelector('.text-input').value = '';

}

function onHamburger() {
    document.querySelector('.sub-navbar').classList.toggle('open-hamb')
}


// SHARE

function uploadImg(elForm, ev) {
    document.getElementById('myCanvas').value = gCanvas.toDataURL("image/jpeg");

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-img').href = 
        `https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">` 
  
    }

    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
    .then(function (res) {
        return res.text()
    })
    .then(onSuccess)
    .catch(function (err) {
        console.error(err)
    })
}

// RESIZE

function resizeCanvas() {
    if (gIsModalOpen) {
        const elContainer = document.querySelector('.control-boxes');

    
        gCanvas.width = elContainer.offsetWidth+20;
        gCanvas.height = elContainer.offsetHeight+20; 
    
    
        console.log(gCanvas.width,gCanvas.height)
    }
}

window.addEventListener('resize', function(){
        // gCanvas.width = window.innerWidth;
        // gCanvas.height = window.innerHeight;
        resizeCanvas()
        loadImg()
})

// SAVED MEMES
function renderSavedMeme() {
    var savedMeme = loadFromStorage(KEY)
    document.querySelector('.saved-memes-flex').innerHTML = `
    <img src="${savedMeme}">`;

}

function openModalMemes() {
    document.querySelector('.saved-memes-container').style.display = 'block';
    document.querySelector('.sub-navbar').classList.remove('open-hamb')
    renderSavedMeme();

}
function onCloseSavedMeme() {
    document.querySelector('.saved-memes-container').style.display = 'none';
}
