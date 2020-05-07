import React from 'react';
import axios from 'axios';

export default class ImageUploader extends React.Component {
  state = { name: '', isUploading: false, selectedFile: '', statusMsg: '' };

  onChangeHandler = (event) => {
    let file = event.target.files[0];
    let formData = new FormData();
    formData.append('file', file);
    this.uploadFile(formData);
  };

  uploadFile = async (formData) => {
    const { url } = this.props;
    this.setState({ isUploading: true, statusMsg: '' });
    let msg = '';
    try {
      let res = await axios.post(url, formData);
      console.log('RES:', res.data);
      msg = `${res.data.originalName} salvo com sucesso como ${res.data.savedName}`;
      this.props.onImageUpload(res.data);
    } catch (err) {
      msg = `Erro: ${err.message}`;
    }
    this.setState({ isUploading: false, selectedFile: '', statusMsg: msg });
  };

  render() {
    let { disabled } = this.props;
    let { isUploading, selectedFile, statusMsg } = this.state;
    return (
      <>
        <label
          style={{
            border: '1px solid white',
            color: disabled ? 'gray' : 'white',
            cursor: disabled ? 'auto' : 'pointer',
            display: 'inline-block',
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={this.onChangeHandler}
            value={selectedFile}
            style={{ display: 'none' }}
            name="file"
            disabled={disabled || isUploading}
          />
          {isUploading ? 'Fazendo upload...' : 'Upload'}
        </label>
        {statusMsg}
      </>
    );
  }
}
