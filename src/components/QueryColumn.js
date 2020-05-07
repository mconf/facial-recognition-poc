import React from 'react';

import ImageUploader from './ImageUploader';
import QueryImagesList from './QueryImagesList';

export default class QueryColumn extends React.Component {
  state = { name: '', queryImages: [] };

  handleImageUpload = (img) => {
    let { queryImages } = this.state;
    this.setState({ queryImages: queryImages.concat(img) });
  };

  render() {
    let { referenceImages } = this.props;
    let { name, queryImages } = this.state;
    return (
      <>
        <h4>Reconhecer face</h4>
        {referenceImages.length > 0 ? (
          <label>
            Referência:
            <select
              value={name}
              onChange={(e) => this.setState({ name: e.target.value })}
            >
              <option key="none" value="">
                Nenhum selecionado
              </option>
              {referenceImages.map((img) => (
                <option key={img} value={img}>
                  {img}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label>Não há imagens de referência para reconhecer</label>
        )}
        <ImageUploader
          url={`queryImages/${name}`}
          disabled={!name}
          onImageUpload={this.handleImageUpload}
        />
        <QueryImagesList queryImages={queryImages} />
      </>
    );
  }
}
