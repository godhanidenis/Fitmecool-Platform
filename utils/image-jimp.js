const Jimp = require("jimp");

async function resizeImage(inputBuffer, width, height) {
  try {
    const image = await Jimp.read(inputBuffer);
    await image.resize(width, height);
    return await image.getBufferAsync(Jimp.AUTO);
  } catch (error) {
    throw new Error(`Error resizing image: ${error.message}`);
  }
}

module.exports = {
  resizeImage,
};
