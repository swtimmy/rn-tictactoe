import * as ImageManipulator from 'expo-image-manipulator';

export class manipulator {
  constructor(uri) {
    this.uri = uri;
    this.actions = [];
  }

  resize = (resize = { width, height }) => {
    const obj = { resize };
    this.actions.push(obj);
    return this;
  };
  //{ originX, originY, width, height }
  crop = (crop = { originX, originY, width, height }) => {
    const obj = { crop };
    this.actions.push(obj);
    return this;
  };

  rotate = (rotate = 0) => {
    const obj = { rotate };
    this.actions.push(obj);
    return this;
  };

  //parameter: "vertical"/"horizontal"
  flip = (flip = ImageManipulator.FlipType.Horizontal) => {
    const obj = { flip };
    this.actions.push(obj);
    return this;
  };

  save = async (options = { compress: 0.7, format: 'jpeg' }) => {
    return await ImageManipulator.manipulateAsync(
      this.uri,
      this.actions, // resize to width of 300 and preserve aspect ratio
      { compress: 0.7, format: 'jpeg', base64: true }
    );
  };

  savePNG = async () => {
    return this.save({
      compress: 0.7,
      format: ImageManipulator.SaveFormat.PNG,
      base64: true
    });
  };

  saveJPG = async () => {
    return this.save({
      compress: 0.7,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true
    });
  };
}