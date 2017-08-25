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
PICTURE_PATH=dist/assets/customer-photos
PICTURE_SUFFIX=.jpg
PEM_FILE=~/.ssh/cloud-node.pem
CLOUD_USER=bitnami
CLOUD_URL=ec2-54-221-218-6.compute-1.amazonaws.com
```
<table>
  <tbody>
    <tr>
      <td colspan="2">Environment Variables</td>
    <tr>
      <th align="center">Variable</th>
      <th align="center">Definition</th>
    </tr>
    <tr>
      <td align="left">
			  NODE_ENV	
      </td>
      <td align="left">
				A string. This will be either `development` or `production`
      </td>
		</tr>
		<tr>
      <td align="left">
			  PORT	
      </td>
      <td align="left">
				A number. This is what port the http routes will be listened to, as in POST url:PORT/route
      </td>
		</tr>
		<tr>
      <td align="left">
				SOCKET_PORT
      </td>
      <td align="left">
				A number. This is the port for the socket.
      </td>
		</tr>
		<tr>
      <td align="left">
				PICTURE_PATH
      </td>
      <td align="left">
				A string.  This is the base directory where the pictures will be put.
      </td>
		</tr>
		<tr>
      <td align="left">
				PICTURE_SUFFIX
      </td>
      <td align="left">
				A string. This is the suffix of the picture files.
      </td>
		</tr>
		<tr>
      <td align="left">
				PEM_FILE
      </td>
      <td align="left">
				A string. This is the path and file of the *.pem file for cloud-node
      </td>
		</tr>
		<tr>
      <td align="left">
				CLOUD_NODE
      </td>
      <td align="left">
				A string. This is a user for rsync (copying pictures).
      </td>
		</tr>
		<tr>
      <td align="left">
        CLOUD_URL
      </td>
      <td align="left">
				This is the URL of the cloud
      </td>
		</tr>
  </tbody>
</table>

*Notes if working on Mac*:  If you want to run this on your Mac instead of the Raspberry Pi:
 - The `POST /api/picture` likely won't work because you don't have raspistill
 - If you don't have the Mirror App in the dist directory, the PICTURE_PATH should be set to a directory that can be made, eg. `customer-photos`. 
 
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
