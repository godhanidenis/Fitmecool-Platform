const Jimp = require("jimp");

async function resizeImage(inputBuffer, width) {
  try {
    const image = await Jimp.read(inputBuffer);
    await image.resize(width, Jimp.AUTO);
    return await image.getBufferAsync(Jimp.AUTO);
  } catch (error) {
    throw new Error(`Error resizing image: ${error.message}`);
  }
}

module.exports = {
  resizeImage,
};
