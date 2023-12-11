const SCALE_FACTOR = 0.3;

export function scaleAndStackImagesAndGetBase64(images: HTMLImageElement[]) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const width = images[0].width;
  const height = images[0].height;

  canvas.width = width * SCALE_FACTOR;
  canvas.height = height * SCALE_FACTOR * images.length;

  images.forEach((image, index) => {
    context.drawImage(
      image,
      0,
      index * height * SCALE_FACTOR,
      width * SCALE_FACTOR,
      height * SCALE_FACTOR
    );
  });

  return canvas.toDataURL("image/jpeg");
}
