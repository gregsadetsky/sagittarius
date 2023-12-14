export function startCamera() {
  // start the camera and pump the video into the #cameraCanvas canvas

  const video = document.querySelector("video") as HTMLVideoElement;

  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .then((stream) => {
      video.srcObject = stream;
      video.play();

      copyToCanvas();
    })
    .catch(function (e) {
      if (
        confirm(
          "An error with camera occurred:(" + e.name + ") Do you want to reload?"
        )
      ) {
        location.reload();
      }
    });
}

function copyToCanvas() {
  const video = document.querySelector("video") as HTMLVideoElement;
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;

  const context = canvas.getContext("2d")!;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  requestAnimationFrame(copyToCanvas);
}

export function stopCamera() {
  // stop the camera
  const video = document.querySelector("video") as HTMLVideoElement;
  const stream = video.srcObject as MediaStream;
  const tracks = stream.getTracks();

  tracks.forEach(function (track) {
    track.stop();
  });

  video.srcObject = null;
}
