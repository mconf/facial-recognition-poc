import React from 'react';

import ImageUploader from './ImageUploader';
import ReferenceImagesList from './ReferenceImagesList';

export default class ReferenceColumn extends React.Component {
  state = { name: '' };

  handleImageUpload = (img) => {
    this.props.pushReferenceImage(img.savedName);
  };

  render() {
    let { referenceImages } = this.props;
    let { name } = this.state;
    return (
      <>
        <h4>Upload imagem de referência</h4>
        <label>
          Nome:
          <input
            type="text"
            value={name}
            onChange={(e) => this.setState({ name: e.target.value })}
          />
        </label>
        <ImageUploader
          url={`referenceImages/${name}`}
          disabled={!name}
          onImageUpload={this.handleImageUpload}
        />
        {referenceImages.length > 0 && (
          <ReferenceImagesList referenceImages={referenceImages} />
        )}
      </>
    );
  }
}
