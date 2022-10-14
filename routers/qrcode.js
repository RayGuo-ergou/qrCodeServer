const express = require('express');
const router = express.Router();

const {
    generate,
    verify,
    getQRcodeById,
    getQR,
    changeQR,
} = require('../controllers/qrcode');

/**
 * @api {get} /api/qr Find QR code(s)
 * @apiName FindQR
 * @apiGroup QR
 * @apiVersion 0.0.1
 * @apiDescription Find QR code(s) by email
 * @apiHeader (auth) {String} authorization The JWT token.
 * @apiHeaderExample {json} Header-Example:
 * {
 *   "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjM0N2ZiMmY0YjY2ZjIzZTE2NWMxZmZlIiwiZW1haWwiOiJ0ZXN0QHQxZTExMTFzdC5jb20iLCJpYXQiOjE2NjU2Njc5MTYsImV4cCI6MTY2NTY3NTExNn0.b65ovmJFbMbXoJuePPd_Di8GUpH_6TnXqkFQR3VJs30"
 * }
 * @apiQuery {String} email Email of the user
 * @apiSuccess {Object} result qrcode array and username
 * @apiSuccess {Object[]} result.qrcodes List of QR codes
 * @apiSuccess {String} result.qrcodes._id ID of the QR code
 * @apiSuccess {String} result.qrcodes.userId ID of the user
 * @apiSuccess {String} result.qrcodes.number Number of the QR code
 * @apiSuccess {String} result.qrcodes.type Type of the QR code
 * @apiSuccess {String} result.qrcodes.lastUsedDate Last used date of the QR code
 * @apiSuccess {String} result.qrcodes.createdAt Creation date of the QR code
 * @apiSuccess {String} result.qrcodes.isActive Status of the QR code
 * @apiSuccess {String} result.qrcodes.nonce Nonce of the QR code(chacha20)
 * @apiSuccess {String} result.qrcodes.token Token of the QR code(chacha20)
 * @apiSuccess {String} result.username Username of the user
 * @apiError (401: Unauthorized) {String} Unauthorized Message You are not authorized to access this resource
 * @apiError (400: Bad Request) {String} MissingEmail Please input email
 * @apiErrorExample {json} Not Authorized:
 * HTTP/1.1 401 Unauthorized
 * {
 *  "message": "You are not authorized to access this resource",
 *  "status": 401
 * }
 * @apiErrorExample {json} Bad Request:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "Please input email",
 *  "status": 400
 * }
 * @apiExample {curl} Example usage:
 * curl -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjM0N2ZiMmY0YjY2ZjIzZTE2NWMxZmZlIiwiZW1haWwiOiJ0ZXN0QHQxZTExMTFzdC5jb20iLCJpYXQiOjE2NjU2Njc5MTYsImV4cCI6MTY2NTY3NTExNn0.b65ovmJFbMbXoJuePPd_Di8GUpH_6TnXqkFQR3VJs30" \
 * -i http://localhost/api/qr?email=test%40test.com
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *   "_id": "6347fb2f4b66f23e165c1ffe",
 *   "userId": "6347fb2f4b66f23e165c1ffe",
 *   "number": "123456789",
 *   "type": "email",
 *   "lastUsedDate": "2021-10-01T00:00:00.000Z",
 *   "createdAt": "2021-10-01T00:00:00.000Z",
 *   "isActive": true,
 *   "nonce": "123456789",
 *   "token": "123456789"
 *  }
 * ]
 * @apiSampleRequest /api/qr
 */
router.get('/', getQR);

/**
 * @api {post} /api/qr Generate QR code
 * @apiName GenerateQR
 * @apiGroup QR
 * @apiVersion 0.0.1
 * @apiDescription Generate QR code
 * @apiHeader (auth) {String} authorization The JWT token.
 * @apiHeaderExample {json} Header-Example:
 * {
 *  "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjM0N2ZiMmY0YjY2ZjIzZTE2NWMxZmZlIiwiZW1haWwiOiJ0ZXN0QHQxZTExMTFzdC5jb20iLCJpYXQiOjE2NjU2Njc5MTYsImV4cCI6MTY2NTY3NTExNn0.b65ovmJFbMbXoJuePPd_Di8GUpH_6TnXqkFQR3VJs30"
 * }
 * @apiBody {Number} type Type of the QR code
 * @apiBody {String} email Email of the user
 * @apiSuccess {String} imageData Image data of the QR code(base64)
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * "base64 image data"
 * @apiError (401: Unauthorized) {String} Unauthorized Message You are not authorized to access this resource
 * @apiError (400: Bad Request) {String} MissingInput All fields are required
 * @apiError (404: Not Found) {String} UserNotFound User does not exist
 * @apiErrorExample {json} Not Authorized:
 * HTTP/1.1 401 Unauthorized
 * {
 *  "message": "You are not authorized to access this resource",
 *  "status": 401
 * }
 * @apiErrorExample {json} Bad Request:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "All fields are required",
 *  "status": 400
 * }
 * @apiErrorExample {json} Not Found:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "User does not exist",
 *  "status": 404
 * }
 * @apiExample {curl} Example usage:
 * curl -X POST -H "Content-Type: application/json" \
 * -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjM0N2ZiMmY0YjY2ZjIzZTE2NWMxZmZlIiwiZW1haWwiOiJ0ZXN0QHQxZTExMTFzdC5jb20iLCJpYXQiOjE2NjU2Njc5MTYsImV4cCI6MTY2NTY3NTExNn0.b65ovmJFbMbXoJuePPd_Di8GUpH_6TnXqkFQR3VJs30" \
 * -d '{"type":1, "email":"test@test.com"}' http://example.com/api/qr
 * @apiSampleRequest /api/qr
 */
router.post('/', generate);

/**
 * @api {get} /api/qr/:id Get a QR code
 * @apiName GetQR
 * @apiGroup QR
 * @apiVersion 0.0.1
 * @apiDescription Get a QR code
 * @apiHeader (auth) {String} authorization The JWT token.
 * @apiHeaderExample {json} Header-Example:
 * {
 *  "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjM0N2ZiMmY0YjY2ZjIzZTE2NWMxZmZlIiwiZW1haWwiOiJ0ZXN0QHQxZTExMTFzdC5jb20iLCJpYXQiOjE2NjU2Njc5MTYsImV4cCI6MTY2NTY3NTExNn0.b65ovmJFbMbXoJuePPd_Di8GUpH_6TnXqkFQR3VJs30"
 * }
 * @apiParam {String} id Number of the QR code
 * @apiQuery {String} email Email of the user
 * @apiSuccess {Object} result result include the QR code and username
 * @apiSuccess {Object} result.qrcode Object of QR code
 * @apiSuccess {String} result.qrcode._id ID of the QR code
 * @apiSuccess {String} result.qrcode.userId ID of the user
 * @apiSuccess {String} result.qrcode.number Number of the QR code
 * @apiSuccess {String} result.qrcode.type Type of the QR code
 * @apiSuccess {String} result.qrcode.lastUsedDate Last used date of the QR code
 * @apiSuccess {String} result.qrcode.createdAt Creation date of the QR code
 * @apiSuccess {String} result.qrcode.isActive Status of the QR code
 * @apiSuccess {String} result.qrcode.nonce Nonce of the QR code(chacha20)
 * @apiSuccess {String} result.qrcode.token Token of the QR code(chacha20)
 * @apiSuccess {String} result.username Username of the user
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "_id": "616f2b2f4b66f23e165c1fff",
 *  "userId": "616f2b2f4b66f23e165c1ffe",
 *  "number": "123456789",
 *  "type": "email",
 *  "lastUsedDate": "2021-10-01T00:00:00.000Z",
 *  "createdAt": "2021-10-01T00:00:00.000Z",
 *  "isActive": true,
 *  "nonce": "123456789",
 *  "token": "123456789"
 * }
 * @apiError (401: Unauthorized) {String} Unauthorized message You are not authorized to access this resource
 * @apiError (400: Bad Request) {String} MissingInput All input are required
 * @apiError (404: Not Found) {String} QRNotFound QR code does not exist
 * @apiError (404: Not Found) {String} UserNotFound User does not exist
 * @apiErrorExample {json} Not Authorized:
 * HTTP/1.1 401 Unauthorized
 * {
 *  "message": "You are not authorized to access this resource",
 *  "status": 401
 * }
 * @apiErrorExample {json} Bad Request:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "All input are required",
 *  "status": 400
 * }
 * @apiExample {curl} Example usage:
 * curl -X GET -H "Content-Type: application/json" \
 * -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjM0N2ZiMmY0YjY2ZjIzZTE2NWMxZmZlIiwiZW1haWwiOiJ0ZXN0QHQxZTExMTFzdC5jb20iLCJpYXQiOjE2NjU2Njc5MTYsImV4cCI6MTY2NTY3NTExNn0.b65ovmJFbMbXoJuePPd_Di8GUpH_6TnXqkFQR3VJs30" \
 * http://example.com/api/qr/1?email=test@te.com
 * @apiSampleRequest /api/qr/:id
 *
 */
router.get('/:id', getQRcodeById);

/**
 * @api {patch} /api/qr/:id Update a QR code
 * @apiName UpdateQR
 * @apiGroup QR
 * @apiVersion 0.0.1
 * @apiDescription Update a QR code
 * @apiHeader (auth) {String} authorization The JWT token.
 * @apiHeaderExample {json} Header-Example:
 * {
 *  "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjM0N2ZiMmY0YjY2ZjIzZTE2NWMxZmZlIiwiZW1haWwiOiJ0ZXN0QHQxZTExMTFzdC5jb20iLCJpYXQiOjE2NjU2Njc5MTYsImV4cCI6MTY2NTY3NTExNn0.b65ovmJFbMbXoJuePPd_Di8GUpH_6TnXqkFQR3VJs30"
 * }
 * @apiParam {String} id Number of the QR code
 * @apiBody {String} email Email of the user
 * @apiSuccess {Object} info information of the QR code after update
 * @apiSuccess {String} info.message 'QR Code changed successfully'
 * @apiSuccess {String} info.stateNow Current state of the QR code(qrcode.isActive)
 * @apiSuccess {Date} info.changeDate Last used date of the QR code
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "QR Code changed successfully",
 *  "stateNow": true,
 *  "changeDate": "2021-10-01T00:00:00.000Z"
 * }
 * @apiError (401: Unauthorized) {String} Unauthorized message You are not authorized to access this resource
 * @apiError (400: Bad Request) {String} MissingInput All input are required
 * @apiError (404: Not Found) {String} QRNotFound QR code does not exist
 * @apiError (404: Not Found) {String} UserNotFound User does not exist
 * @apiErrorExample {json} Not Authorized:
 * HTTP/1.1 401 Unauthorized
 * {
 *  "message": "You are not authorized to access this resource",
 *  "status": 401
 * }
 * @apiErrorExample {json} Bad Request:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "All input are required",
 *  "status": 400
 * }
 * @apiExample {curl} Example usage:
 * curl -X PATCH -H "Content-Type: application/json" \
 * -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjM0N2ZiMmY0YjY2ZjIzZTE2NWMxZmZlIiwiZW1haWwiOiJ0ZXN0QHQxZTExMTFzdC5jb20iLCJpYXQiOjE2NjU2Njc5MTYsImV4cCI6MTY2NTY3NTExNn0.b65ovmJFbMbXoJuePPd_Di8GUpH_6TnXqkFQR3VJs30" \
 * -d '{"email": "test@test.com"}' \
 * http://example.com/api/qr/1
 * @apiSampleRequest /api/qr/:id
 *
 */
router.patch('/:id', changeQR);

/**
 * @api {post} /api/qr/scan verify a QR code
 * @apiName ScanQR
 * @apiGroup QR
 * @apiVersion 0.0.1
 * @apiDescription verify a QR code
 * @apiHeader (auth) {String} authorization The JWT token.
 * @apiHeaderExample {json} Header-Example:
 * {
 *  "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjM0N2ZiMmY0YjY2ZjIzZTE2NWMxZmZlIiwiZW1haWwiOiJ0ZXN0QHQxZTExMTFzdC5jb20iLCJpYXQiOjE2NjU2Njc5MTYsImV4cCI6MTY2NTY3NTExNn0.b65ovmJFbMbXoJuePPd_Di8GUpH_6TnXqkFQR3VJs30"
 * }
 * @apiBody {String} token Token of the QR code
 * @apiSuccess {Object} info information of the QR code after update
 * @apiSuccess {String} info.message 'QR Code changed successfully'
 * @apiSuccess {String} info.user Email of the user
 * @apiSuccess {String} info.number Number of the QR code
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "QR Code changed successfully",
 *  "user": "test@test.com",
 *  "number": "1"
 * }
 * @apiError (401: Unauthorized) {String} Unauthorized message You are not authorized to access this resource
 * @apiError (400: Bad Request) {String} MissingToken Token is required
 * @apiError (404: Not Found) {String} QRNotFound QR code does not exist
 * @apiError (400: Bad Request) {String} InvalidToken Token is invalid
 *
 * @apiErrorExample {json} Not Authorized:
 * HTTP/1.1 401 Unauthorized
 * {
 *  "message": "You are not authorized to access this resource",
 *  "status": 401
 * }
 * @apiErrorExample {json} Bad Request:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "All input are required",
 *  "status": 400
 * }
 * @apiExample {curl} Example usage:
 * curl -X POST -H "Content-Type: application/json" \
 * -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjM0N2ZiMmY0YjY2ZjIzZTE2NWMxZmZlIiwiZW1haWwiOiJ0ZXN0QHQxZTExMTFzdC5jb20iLCJpYXQiOjE2NjU2Njc5MTYsImV4cCI6MTY2NTY3NTExNn0.b65ovmJFbMbXoJuePPd_Di8GUpH_6TnXqkFQR3VJs30" \
 * -d '{"token": "1"}' \
 * http://example.com/api/qr/scan
 * @apiSampleRequest /api/qr/scan
 */
router.post('/scan', verify);

module.exports = router;
