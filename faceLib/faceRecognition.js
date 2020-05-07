import * as faceapi from 'face-api.js';
import { promises as fs } from 'fs';

import canvas from './canvas';

export default async function faceRecognition() {
  console.log('Loading ref img');
  const referenceImage = await canvas.loadImage('./faceApi/images/bbt1.jpg');
  console.log('Loading query img');
  const queryImage = await canvas.loadImage('./faceApi/images/bbt4.jpg');
  console.log('Detecting faces in ref img');
  const resultsRef = await faceapi
    .detectAllFaces(referenceImage)
    .withFaceLandmarks()
    .withFaceDescriptors();
  console.log('Detecting faces in query img');
  const resultsQuery = await faceapi
    .detectAllFaces(queryImage)
    .withFaceLandmarks()
    .withFaceDescriptors();
  console.log('Creating face matcher');
  const faceMatcher = new faceapi.FaceMatcher(resultsRef);

  const labels = faceMatcher.labeledDescriptors.map((ld) => ld.label);
  console.log('Drawing boxes in ref');
  const refDrawBoxes = resultsRef
    .map((res) => res.detection.box)
    .map((box, i) => new faceapi.draw.DrawBox(box, { label: labels[i] }));
  const outRef = faceapi.createCanvasFromMedia(referenceImage);
  refDrawBoxes.forEach((drawBox) => drawBox.draw(outRef));
  console.log('Writing ref img file');
  await fs.writeFile('referenceImage.jpg', outRef.toBuffer('image/jpeg'));
  console.log('Finding best match');
  const queryDrawBoxes = resultsQuery.map((res) => {
    const bestMatch = faceMatcher.findBestMatch(res.descriptor);
    return new faceapi.draw.DrawBox(res.detection.box, {
      label: bestMatch.toString(),
    });
  });
  const outQuery = faceapi.createCanvasFromMedia(queryImage);
  queryDrawBoxes.forEach((drawBox) => drawBox.draw(outQuery));
  console.log('Writing query img file');
  await fs.writeFile('queryImage.jpg', outQuery.toBuffer('image/jpeg'));
  console.log('Done.');
}
