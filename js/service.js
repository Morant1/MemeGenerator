'use strict';
var gKeywords = { 'happy': 12, 'funny puk': 1 }
const IMG_NUMBER = 10;
const X = 197;
var Y = 60;
var gIsDesc = false;

var INCREASE_FONT = 5;
var gImgKeywords = [
    ['president','men'],['dogs'],['dogs','baby'], ['cats'],['men','baby'],
    ['men'],['baby'],['men'],['baby'],['president','men']
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
            x:X,
            y:Y
        }
    ]
}


function setMineLine() {
    var newLine =  _createNewLine();
    gMeme.lines.push(newLine);
    gMeme.selectedLineIdx++;

}


function _createNewLine(){
    Y = Y+50;
    return {
        txt: '',
        size: 40,
        align: 'left',
        color: 'red',
        x:X,
        y:Y
    }

}

function setMemeID(imgId) {
    gMeme.selectedImgId = imgId;
}
function setMemeSize(desc = false) {
    if (!desc) gMeme.lines[gMeme.selectedLineIdx].size+=INCREASE_FONT;
    else gMeme.lines[gMeme.selectedLineIdx].size-=INCREASE_FONT;
    
}


function setMimeDirection(direction) {
    gMeme.lines[gMeme.selectedLineIdx].align=direction;
}
function setMimeColor(){
    gMeme.lines[gMeme.selectedLineIdx].color=getRandomColor();
}

function setMemeText(text) {
    gMeme.lines[gMeme.selectedLineIdx].txt=text;

}

function getMeme() {
    return gMeme;
}

function deleteMemeList() {
    gMeme.lines.pop()
    gMeme.selectedLineIdx--;
 

}

function createImgs() {
    for (var i = 0 ; i < IMG_NUMBER ; i++) {
        var currImg = _createImg(i+1,`./square-imgs/${i+1}.jpg`);
        currImg.keywords.push(...gImgKeywords[i])
        gImgs.push(currImg);

    }

    return gImgs;

}

function _createImg(id,url) {
    return {
        id,
        url,
        keywords: []
    }

}

function getCurrIdx() {
   
   if (!gIsDesc) {
       gMeme.selectedLineIdx--;
       if (gMeme.selectedLineIdx === 0 ) gIsDesc = true;
    
   } else {
        gMeme.selectedLineIdx++;
        if (gMeme.selectedLineIdx===gMeme.lines.length-1) gIsDesc = false;
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

