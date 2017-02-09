// read and draw the image selected by user
function fileHandler(evt) {
  // get file for meme
  var file = evt.target.files[0];

  // create new FileReader obj
  var reader = new FileReader();

  // define function execute AFTER the file successfully read
  reader.onload = function(fileObject) {
    // get content of the file(URL for the img)
    var data = fileObject.target.result;
    // create new image obj
    var image = new Image();
    // execute AFTER img loaded
    image.onload = function() {
      memeImg = this;
      drawMeme(memeImg, null, null);
    }
    // set src of the img to be the URL read from file
    image.src = data;
  };

  // START read the file for meme
  reader.readAsDataURL(file);

  // reset text input
  document.getElementById('text-top').value = '';
  document.getElementById('text-bottom').value = '';
  topText = '';
  bottomText = '';
}

// draw text to meme refer to user input
function textHandler(evt) {
  var textId = evt.target.id;
  switch (textId) {
    case 'text-top':
      topText = evt.target.value;
      break;
    case 'text-bottom':
      bottomText = evt.target.value;
      break;
    default:
  }
  drawMeme(memeImg, [topText, bottomText], textStyle);
}

// draw meme on the canvas
function drawMeme(memeImage, memeText, styleOfText) {
  // get canvas area
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  // change canvas size according to memeImage
  var containerWidth = document.getElementById('meme-container').clientWidth;
  var containerHeight = document.getElementById('meme-container').clientHeight;
  var containerRatio = containerWidth / containerHeight;
  if (memeImage.width/memeImage.height >= containerRatio && memeImage.width > containerWidth) {
    canvas.height = Math.round(containerWidth * memeImage.height / memeImage.width);
    canvas.width = containerWidth;
  }
  else if (memeImage.width/memeImage.height < containerRatio && memeImage.height > containerHeight){
    canvas.width = Math.round(containerHeight * memeImage.width / memeImage.height) ;
    canvas.height = containerHeight;
  }
  else {
    canvas.width = memeImage.width;
    canvas.height = memeImage.height;
  }
  canvas.style.transform = 'translateY(' + ((containerHeight - canvas.height) / 2) +'px)';

  // draw img
  ctx.drawImage(memeImage, 0, 0, canvas.width, canvas.height);

  // draw text
  ctx.textAlign = 'center';
  if (memeText != null) {
    for (i = 0; i < memeText.length; i++) {
      if (memeText[i] != null) {
        ctx.font = styleOfText.size[i] + ' ' + styleOfText.fontFamily[i];
        ctx.fillStyle = styleOfText.fillColor[i];
        ctx.strokeStyle = styleOfText.strokeColor[i];
        ctx.fillText(memeText[i], canvas.width/2, styleOfText.posY[i] + canvas.height * (styleOfText.posY[i] < 0));
        ctx.strokeText(memeText[i], canvas.width/2, styleOfText.posY[i] + canvas.height * (styleOfText.posY[i] < 0));
        // console.log(document.querySelector('body').getAttribute("fontSize"));
      }
    }
  }
}

function changeTextSize() {
  var textSizeName = this.name;
  var textSize = this.value;
  if (textSizeName === 'text-size-top') {
    textStyle.size[0] = textSize + 'px';
    textStyle.posY[0] = textSize / 1;
  } else if (textSizeName === 'text-size-bottom') {
    textStyle.size[1] = textSize + 'px';
    textStyle.posY[1] = - textSize / 3;
  };
  drawMeme(memeImg, [topText, bottomText], textStyle);
}

// open new window to save meme
function saveMeme() {
  window.open(document.getElementById('canvas').toDataURL());
}

var topText = '';
var bottomText = '';
var textStyle = {
  'size': ['48px', '48px'],
  'fontFamily': ['Impact', 'Impact'],
  'strokeColor': ['white', 'white'],
  'fillColor': ['black', 'black'],
  'posY': [50, -15]
};

document.getElementById('file-select').addEventListener('change', fileHandler, false);
document.getElementById('text-top').addEventListener('input', textHandler, false);
document.getElementById('text-bottom').addEventListener('input', textHandler, false);
document.getElementById('top-text-size').addEventListener('change', changeTextSize, false);
document.getElementById('bottom-text-size').addEventListener('change', changeTextSize, false);
document.getElementById('save-button').addEventListener('click', saveMeme, false);
