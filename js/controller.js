'use strict';
var gCanvas;
var gIsModalOpen = false;
var gCtx;
var gCurrId;
var gStickerNum;
const KEY = 'memes';
var gTouchstart = false;
var gImgData;
var gSavedMemes = [];




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

    document.querySelector('.grid-image-container').innerHTML = strHtmls.join('');
}


function onImgClicked(id) {
    gCurrId = id;
    setMemeID(id);
    openMemeModal()
}



function openMemeModal() {
    document.querySelector('.modal-meme').style.visibility = 'visible';
    gIsModalOpen = true;
    document.querySelector('.hide-grid').style.display = 'none';
    gCanvas = document.getElementById('myCanvas');
    gCtx = gCanvas.getContext('2d');
    loadImg();
    resizeCanvas()

}


function onSaveToStorage() {
    gSavedMemes.push(gCanvas.toDataURL())
    saveToStorage(KEY, gSavedMemes);    
     renderSavedMeme()
}

function loadImg() {
    if (gIsModalOpen) {
        setMemeCoorX(gCanvas.width)
        const img = new Image();
        img.src = `square-imgs/${gCurrId}.jpg`;
        img.onload = () => {
            gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
            if (gImgData) {
                gCtx.putImageData(gImgData, 0, 0);
            }
            drawText();
        }
    }
}

function drawText() {
    var meme = getMeme();
    // !meme.lines[meme.selectedLineIdx].txt &&
        if ( !gTouchstart) { 
            var text = document.querySelector('.text-input').value;
            console.log("TEXT",text)
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
    gTouchstart = false;
}




// Sticker

function onDragSticker(ev,num) {
    gTouchstart = true;
    gStickerNum = num;
}

function onDropSticker(ev) {
    if (gTouchstart) {
        var offsetX, offsetY;
        if (ev.type === "touchstart") {
            offsetX = ev.touches[0].clientX - 100;
            offsetY = ev.touches[0].clientY - 100;

        } else {
            offsetX = ev.offsetX;
            offsetY = ev.offsetY;
        }
        // 
        if (!gImgData) {
        // clearCanvas();
        var img = new Image();
        img.src = `square-imgs/${gCurrId}.jpg`;
        } 
        // 
        const sticker = new Image();
        sticker.src = `./stickers/sticker${gStickerNum}.jpg`;
        sticker.onload = () => {
            var w = (sticker.width) * 4.5;
            var h = (sticker.height) * 4.5;
            // 
            if (!gImgData) {
            gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
            } else {
                gCtx.putImageData(gImgData, 0, 0);
            }
            // 
            gCtx.drawImage(sticker, 0, 0, w, h, offsetX, offsetY, gCanvas.width, gCanvas.height);
            gImgData = gCtx.getImageData(0, 0, w, h, offsetX, offsetY, gCanvas.width, gCanvas.height);
            drawText()
        }
    }

}

// CONTROL CANVAS BOX

function onClickup() {
    changeTextPos(false);
    loadImg();
}

function onClickDown() {
    changeTextPos(true);
    loadImg();
}


function onSwitchLines() {

    var meme = getMeme();
    getCurrIdx()
    var coordX = meme.lines[meme.selectedLineIdx].x;
    var coordY = meme.lines[meme.selectedLineIdx].y;

    gCtx.beginPath();
    gCtx.moveTo(coordX - 200, coordY + 10);
    gCtx.lineTo(coordX + 200, coordY + 10);
    gCtx.strokeStyle = 'yellow';
    gCtx.lineWidth = 3;
    gCtx.stroke();
    setTimeout(loadImg, 500);

}

function onSearch() {
    var searchInput = document.querySelector('.search-input').value;
    filterImages(searchInput);
    renderImgs();
}
function onAddText() {

        var widthCanvas = gCanvas.width;
        var heightCanvas = gCanvas.height;
        setMineLine(widthCanvas, heightCanvas);
        
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
    gIsModalOpen = false;
    gImgData = null;


    resetLines();
    document.querySelector('.text-input').value = '';

}

function resetCanves() {
    clearCanvas()
    resetLines();
    document.querySelector('.text-input').value = '';
    gImgData = null;
    loadImg()

}

function onHamburger() {
    document.querySelector('.sub-navbar').classList.toggle('open-hamb')
}


// SHARE

function uploadImg(elForm, ev) {
    document.getElementById('myCanvas').value = gCanvas.toDataURL("image/jpeg");
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

        gCanvas.width = elContainer.offsetWidth + 35;
        gCanvas.height = elContainer.offsetHeight + 40;
    }
}

window.addEventListener('resize', function () {
    resizeCanvas()
    loadImg()
})

// SAVED MEMES
function renderSavedMeme() {
    var savedMemes = loadFromStorage(KEY)
    var innerHtmls = '';
    if (savedMemes && savedMemes.length !== 0) {
        for (var i = 0; i < savedMemes.length; i++) {
            innerHtmls += '<div style="font-family:Euro;color:white;font-size:1.2rem;">Click on image to delete</div>'
            innerHtmls += `<img onclick="removeSavedMeme(${i})"class="saved"src="${savedMemes[i]}">`;
        }
        document.querySelector('.saved-memes-flex').innerHTML = innerHtmls;
    } else {
        document.querySelector('.saved-memes-flex').innerHTML = `
        <div style="color:white;">NO SAVED MEMES YET</div>`;
    }
}

function removeSavedMeme(memeIdx) {
    gSavedMemes.splice(memeIdx,1);
    saveToStorage(KEY, gSavedMemes); 
    renderSavedMeme()
}

function openModalMemes() {
    document.querySelector('.saved-memes-container').style.display = 'block';
    document.querySelector('.sub-navbar').classList.remove('open-hamb')
    renderSavedMeme();

}
function onCloseSavedMeme() {
    document.querySelector('.saved-memes-container').style.display = 'none';
}
