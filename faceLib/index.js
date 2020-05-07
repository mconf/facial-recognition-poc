import * as faceapi from 'face-api.js';
import { promises as fs } from 'fs';

import canvas from './canvas';

export async function init() {
  // Load models
  Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromDisk('./faceLib/models'),
    faceapi.nets.faceLandmark68Net.loadFromDisk('./faceLib/models'),
    faceapi.nets.faceRecognitionNet.loadFromDisk('./faceLib/models'),
  ]).then(() => {
    console.log('Models loaded.');
  });
}

export async function faceRecognition(queryPath, referencePath) {
  console.log('Loading query img');
  const queryImage = await canvas.loadImage(queryPath);
  console.log('Detecting faces in query img');
  const queryDetection = await faceapi
    .detectSingleFace(queryImage)
    .withFaceLandmarks()
    .withFaceDescriptor();
  if (!queryDetection) {
    throw 'Unable to detect face in query ' + queryPath;
  }
  console.log('Loading ref img');
  const referenceImage = await canvas.loadImage(referencePath);
  console.log('Detecting faces in ref img');
  const referenceDetection = await faceapi
    .detectAllFaces(referenceImage)
    .withFaceLandmarks()
    .withFaceDescriptors();
  if (!referenceDetection) {
    throw 'Unable to detect face in reference ' + referenceName;
  }
  console.log('Creating face matcher');
  const faceMatcher = new faceapi.FaceMatcher(referenceDetection);

  const bestMatch = faceMatcher.findBestMatch(queryDetection.descriptor);
  return bestMatch.distance;
}
