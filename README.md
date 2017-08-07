# mm-server

This is a little Node/Express application that is designed to run on a Raspberry Pi.  It takes a picture of a barcode and reads the barcode in the picture.

## Install

- Clone the repository
- npm install
- Make the .env file:
```
NODE_ENV=development
PORT=3000
PICTURE_PATH=/images/camera.jpg
```
- Run the code
```
npm run watch
```
