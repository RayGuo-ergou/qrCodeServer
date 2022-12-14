import express, { RequestHandler } from 'express';
const router = express.Router();
import authController from '../controllers/auth';
const { login, register, getUser, logout } = authController;

/**
 * @api {get} /api/user/login Login
 * @apiName Login
 * @apiGroup User
 * @apiVersion 0.0.1
 * @apiDescription Login to the application and get a token
 * @apiQuery {String} email Email of the user
 * @apiQuery {String} password Password of the user
 * @apiSuccess {String} username Username of the user
 * @apiSuccess {String} email Email of the user
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "username": "Test User",
 *  "email": "test@test.com"
 * }
 * @apiError (400) MissingInput All input is required
 * @apiError (400) InvalidCredentials The email and(or) password is incorrect
 * @apiError (500) InternalServerError There was an error logging in
 * @apiErrorExample {json} Missing parameters
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "All input is required",
 *  "status": 400
 * }
 * @apiErrorExample {json} Invalid credentials
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "Invalid credentials",
 *  "status": 400
 * }
 * @apiExample {curl} Example usage:
 * curl -i http://example.com/api/user/login?email=test%40test.com&password=123456
 * @apiSampleRequest /api/user/login
 */
router.get('/login', login as RequestHandler);

router.get('/logout', logout as RequestHandler);

/**
 * @api {get} /api/user Get User
 * @apiName GetUser
 * @apiGroup User
 * @apiVersion 0.0.1
 * @apiDescription Check if the user is logged in
 * @apiSuccess {String} Message Message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "User found"
 * }
 * @apiError (401) Unauthorized The user is not logged in
 * @apiErrorExample {json} Unauthorized
 * HTTP/1.1 401 Unauthorized
 * {
 *  "message": "You are not authorized to access this resource",
 *  "status": 401
 * }
 * @apiExample {curl} Example usage:
 * curl -i http://example.com/api/user
 * @apiSampleRequest /api/user
 *
 */
router.get('/', getUser as RequestHandler);

/**
 * @api {post} /api/user Register a new user
 * @apiName RegisterUser
 * @apiGroup User
 * @apiBody {String} key The admin to register a new user, we are not allow
 * everyone to register now
 * @apiBody {String} first_name User's first name
 * @apiBody {String} last_name User's last name
 * @apiBody {String} email User's email
 * @apiBody {String} password User's password
 * @apiBody {Number} [role=1] User's role
 * @apiDescription Register a new user with first name, last name, email and password
 * @apiError (401: Unauthorized) {String} Unauthorized message You are not authorized to access this resource
 * @apiError (400: Bad Request) {String} MissingInput message All input is required
 * @apiError (400: Bad Request) {String} InvalidEmail message Invalid email format
 * @apiError (409: Conflict) {String} Conflict message User Already Exist. Please Login
 * @apiError (500) InternalServerError There was an error signing up
 * @apiErrorExample {json} Not Authorized:
 * HTTP/1.1 401 Unauthorized
 * {
 *  "message": "You are not authorized to access this resource",
 *  "status": 401
 * }
 * @apiErrorExample {json} Bad Request:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "All input is required",
 *  "status": 400
 * }
 *
 *
 * @apiSuccess {String} status If the request success.
 * @apiSuccess {String} message message about the request.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "status": success,
 *  "message": 'User created successfully',
 * }
 * @apiExample {curl} Example usage:
 * curl -X POST \
 *  http://example.com/api/user \
 * -H 'Content-Type: application/json' \
 * -d '{
 *  "key": "adminkey",
 *  "first_name": "test",
 *  "last_name": "test",
 *  "email": "admin@test.com",
 *  "password": "test"
 * }'
 * @apiSampleRequest /api/user
 * @apiVersion 0.0.1
 */
router.post('/', register as RequestHandler);

export default router;
