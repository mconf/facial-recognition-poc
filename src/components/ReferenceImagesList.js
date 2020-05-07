import React from 'react';

export default function ReferenceImagesList({ referenceImages }) {
  return (
    <>
      <h4>Imagens de referência</h4>
      {referenceImages.map((img) => (
        <li key={img}>
          {img}
          <br />
          <img
            src={`/referenceImages/${img}?randomToAvoidCache=${Date.now()}`}
            alt={img}
          />
        </li>
      ))}
    </>
  );
}
