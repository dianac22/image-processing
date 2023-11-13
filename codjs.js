var dog = new Image(); //created the image object
var dogImage = document.getElementById('dog-img'); //takes the 'dog-img' attribute and assigns it to the variable dogImage

async function getDogs()
{
    let start = performance.now();
    let url ="https://dog.ceo/api/breeds/image/random";
    try{
        let result = await fetch(url);
        const data = await result.json(); //makes a request to the API endpoint and retrieves the JSON response
        const imageURL = data.message; //the message is the image url
        const imageResult = await fetch(imageURL); //retrieves the image from that url and then assigns it to blob
        const blob = await imageResult.blob();
        const imageObject = URL.createObjectURL(blob); //it creates an object url
        console.log(data);
        dog.src = imageObject; //assigns the image object's src property to this object url
        dogImage.appendChild(dog); //it appends the image object to the variable dogImage so the image appears in the designated box
    }
    catch(error){
        console.log(error);
    }
    let end = performance.now();
    let time = end-start;
    console.log(time); //execution time
}

//mirror image

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = "300";
canvas.height = "300";

dog.crossOrigin = "Anonymous";

function mirror(){
    let start = performance.now();
    ctx.drawImage(dog, 0, 0, canvas.width, canvas.height);
    const img1 = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log(img1);
    var scannedImage = img1.data;
    console.log(scannedImage);
    //reverse the image by reversing the pixels from the left of the image with the pixels from the right, like you normally would an array
    for(var y=0; y<canvas.height; y++) {
      for(var x=0; x<canvas.width/2; x++) {
      var index1 = (y * canvas.width + x) * 4;
      var index2 = (y * canvas.width + canvas.width - x - 1) * 4;
  
      var red = scannedImage[index1];
      var green = scannedImage[index1 + 1];
      var blue = scannedImage[index1 + 2];
      var alpha = scannedImage[index1 + 3];
  
      scannedImage[index1] = scannedImage[index2];
      scannedImage[index1 + 1] = scannedImage[index2 + 1];
      scannedImage[index1 + 2] = scannedImage[index2 + 2];
      scannedImage[index1 + 3] = scannedImage[index2 + 3];
  
      scannedImage[index2] = red;
      scannedImage[index2 + 1] = green;
      scannedImage[index2 + 2] = blue;
      scannedImage[index2 + 3] = alpha;
    }
  }
  //put the modified image back on the canvas
    ctx.putImageData(img1, 0, 0);
    let end = performance.now();
    let time = end-start;
    console.log(time); //execution time
    timeout = setTimeout(smoothImage, 3000);

    function smoothImage() {
        let start = performance.now();
      var scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = scannedImage.data;

      var smoothKernel = [ //the intensity of the filter
        1/9, 1/9, 1/9,
        1/9, 1/9, 1/9,
        1/9, 1/9, 1/9
    ];

    var newData = new Uint8ClampedArray(data);

    for (var i = 0; i < data.length; i++) {   //it applies the smoothing kernel to each pixel 
        if ((i + 1) % 4 === 0) continue;  //checks if the current index is divisible by for and contiues only if it is true
        var x = (i / 4) % canvas.width;
        var y = Math.floor((i / 4) / canvas.width); //calculates the x and y coordinates of the current pixel being processed
        var r = 0;
        for (var kx = -1; kx <= 1; kx++) {
            for (var ky = -1; ky <= 1; ky++) {  //is used to iterate through the kernel(3*3 smooth kernel) by going through each element starting from -1 to 1 in the
                                                //x, y axis
                var k = ((y + ky) * canvas.width + (x + kx)) * 4;
                if (k < 0 || k >= data.length) continue;  //calculates the new index and checks if it is within the limits of the data array
                r += data[k] * smoothKernel[(kx + 1) + (ky + 1) * 3];  //multiplies the current pixel intensity by the corresponding element in the kernel
            }
        }
        newData[i] = r;  //here we store the results 
    } //in the end, the loop goes through each pixel in the array and applies the filter and then stores it in the newData array and puts it back on the canvas
    ctx.putImageData(new ImageData(newData, canvas.width, canvas.height), 0, 0);
    let end = performance.now();
    let time = end-start;
    console.log(time); //execution time
    }
  }
