import React from 'react';
import axios from 'axios';

import './App.css';
import QueryColumn from './components/QueryColumn';
import ReferenceColumn from './components/ReferenceColumn';

class App extends React.Component {
  state = { isLoading: false, referenceImages: [], error: null };

  componentDidMount() {
    this.fetchReferenceImages();
  }

  fetchReferenceImages = async () => {
    this.setState({ isLoading: true });
    try {
      let res = await axios.get('/referenceImages');
      this.setState({ isLoading: false, referenceImages: res.data });
    } catch (err) {
      this.setState({ isLoading: false, error: err.message });
    }
  };

  pushReferenceImage = (img) => {
    let imgs = new Set(this.state.referenceImages);
    imgs.add(img);
    imgs.delete(undefined);
    this.setState({ referenceImages: Array.from(imgs) });
  };

  render() {
    const { isLoading, error, referenceImages } = this.state;
    return (
      <div className="App">
        <h2>Reconhecimento facial PoC</h2>
        {isLoading ? (
          'Carregando imagens de referência...'
        ) : (
          <input
            type="button"
            value="Recarregar imagens"
            onClick={this.fetchReferenceImages}
          />
        )}
        <div style={{ color: 'red' }}>{JSON.parse(error)}</div>
        <div className="row">
          <div className="column">
            <QueryColumn
              referenceImages={referenceImages}
              pushReferenceImage={this.pushReferenceImage}
            />
          </div>
          <div className="column">
            <ReferenceColumn
              referenceImages={referenceImages}
              pushReferenceImage={this.pushReferenceImage}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
