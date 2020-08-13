'use strict';
var gKeywords = { 'happy': 12, 'funny puk': 1 }
const IMG_NUMBER = 18;
// var X = 160;
var X;
var Y = 60;
var gSortedImgs;


var FIXED_NUM = 5;
var gImgKeywords = [
    ['president', 'men'], ['dogs'], ['dogs','babies'], ['cats'], ['babies'],
    ['men'], ['babies'], ['men'], ['babies'], ['president', 'men'], ['men'], ['men'],
    ['men'], ['men'], ['men'], ['men'], ['men'], ['men']
];

var gImgs = [];

var gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: [
        {
            txt: '',
            size: 40,
            align: 'left',
            color: 'red',
            x: X,
            y: Y
        }
    ]
}


function setMineLine(width, height) {
    if (gMeme.lines.length === 3) return;
    var newLine = _createNewLine(width, height);
    gMeme.lines.push(newLine);
    gMeme.selectedLineIdx++;

}


function _createNewLine(width, height) {
    var newY;
    var newX = X;
    if (gMeme.selectedLineIdx === 1) newY = height - (height/2);
    else newY = height - Y;
    return {
        txt: '',
        size: 40,
        align: 'left',
        color: 'red',
        x: newX,
        y: newY
    }

}

function changeTextPos(isDown = true) {

    if (!isDown) {
        gMeme.lines[gMeme.selectedLineIdx].y -= FIXED_NUM;
    } else {
        gMeme.lines[gMeme.selectedLineIdx].y += FIXED_NUM;
    }
}

function setMemeID(imgId) {
    gMeme.selectedImgId = imgId;
}
function setMemeSize(desc = false) {
    if (!desc) gMeme.lines[gMeme.selectedLineIdx].size += FIXED_NUM;
    else gMeme.lines[gMeme.selectedLineIdx].size -= FIXED_NUM;

}
// 
function setMimeCoorX(coorx) {
    X = coorx / 2;
    gMeme.lines[gMeme.selectedLineIdx].x = X;
}
// 
function resetLines() {
    gMeme.lines =  [
        {
            txt: '',
            size: 40,
            align: 'left',
            color: 'red',
            x: X,
            y: Y
        }
    ];
    gMeme.selectedLineIdx = 0;
}

function setMimeDirection(direction) {
    gMeme.lines[gMeme.selectedLineIdx].align = direction;
}
function setMimeColor() {
    gMeme.lines[gMeme.selectedLineIdx].color = getRandomColor();
}

function setMemeText(text) {
    gMeme.lines[gMeme.selectedLineIdx].txt = text;

}

function getMeme() {
    return gMeme;
}

function deleteMemeList() {
    gMeme.lines.pop();
    gMeme.selectedLineIdx--;


}

function createImgs() {
    if (gSortedImgs) {
        return gSortedImgs;
    }

    for (var i = 0; i < IMG_NUMBER; i++) {
        var currImg = _createImg(i + 1, `./square-imgs/${i + 1}.jpg`);
        currImg.keywords.push(...gImgKeywords[i])
        gImgs.push(currImg);

    }

    return gImgs;

}

function filterImages(searchInput) {

    if (!searchInput) return;
    if (searchInput === 'all') {
        gSortedImgs = gImgs;
        return;
    }

    gSortedImgs = [];
    for (var i = 0; i < IMG_NUMBER; i++) {
        for (var j = 0; j < gImgs[i].keywords.length; j++) {
            if (gImgs[i].keywords[j] === searchInput) {
                gSortedImgs.push(gImgs[i]);
                console.log(gSortedImgs)
            }
        }

    }
}

function _createImg(id, url) {
    return {
        id,
        url,
        keywords: []
    }

}

function getCurrIdx() {

    gMeme.selectedLineIdx--;
    if (gMeme.selectedLineIdx < 0) {
        gMeme.selectedLineIdx = gMeme.lines.length - 1;
    }


}

// function getImgById(id) {
//     var imgIdx = _getImgIndex(id);

//     return gImgs[imgIdx];
// }


// function _getImgIndex(id) { 
//     var imgIdx = gImgs.findIndex(function (img) {
//         return id === img.id;
//     })

//     return imgIdx;

// }

