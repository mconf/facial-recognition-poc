import React from 'react';

export default function QueryImagesList({ queryImages }) {
  return (
    <>
      <h4>Imagens consultadas</h4>
      {queryImages.map((img) => (
        <li key={img.savedName}>
          {img.savedName.split('-')[0]} Distância: {img.distance.toFixed(2)}
          <br />
          <img src={`/queryImages/${img.savedName}`} alt={img} />
        </li>
      ))}
    </>
  );
}
