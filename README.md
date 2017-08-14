# mm-server

This is a little Node/Express application that is designed to run on a Raspberry Pi.  It takes a picture of a barcode and reads the barcode in the picture.

## Install

- Clone the repository
- npm install
- Make the .env file:
```
NODE_ENV=development
PORT=3000
SOCKET_PORT=4000
PICTURE_PATH=images
```
The picture path is the directory in the root of the project where the pictures will go. If this doesn't exist, it will be created.
 
The SOCKET_PORT is the port the socket will look at.  If SOCKET_PORT is 4000, then Angular needs to do something like this:
```
import * as io from "socket.io-client";
...
  socket = io('http://localhost:4000');
```

- Run the code
For development:
```
npm run watch
```
or:
```
node server.js
```

## Routes

```
PUT '/api/barcode'
```
This is hardcoded to return '123456'.  I left it there as an example of how to add a new module and route.
```
POST '/api/picture'
```
This accepts a body like this:
```
{
  "directory": "paul",    // required
  "base_name": "camera",  // optional - basename of image, default is 'camera'
  "options": {            // optional - options for raspistill
    "rot": "180",
    "quality": "100"
  }
}
``` 
It uses PICTURE_PATH. If PICTURE_PATH="images", then the above body will execute the raspistill command like this:
```
raspistill -rot 180 --quality 100 -o images/paul/camera80417
```
The '80417' on the end of the filename is the hour, minute, second the picture was taken.  This route will respond with the path of the picture as in "images/paul/camera80417"
