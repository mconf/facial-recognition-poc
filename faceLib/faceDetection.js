import * as faceapi from 'face-api.js';
import { promises as fs } from 'fs';

import canvas from './canvas';

export default async function faceDetection() {
  console.log('Loading image');
  const input = await canvas.loadImage('./faceApi/images/bbt1.jpg');
  console.log('Detecting face');
  const detection = await faceapi.detectSingleFace(input);
  console.log('Drawing detection');
  const out = faceapi.createCanvasFromMedia(input);
  faceapi.draw.drawDetections(out, detection);
  console.log('Writing file');
  await fs.writeFile('detection.jpg', out.toBuffer('image/jpeg'));
  console.log('File written');
}
