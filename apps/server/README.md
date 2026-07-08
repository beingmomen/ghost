# Express Project with MongoDB and Mongoose

A robust Express.js backend API with MongoDB integration, featuring advanced authentication, image handling system, validation middleware, and comprehensive security implementations. Built with MVC architecture and deployed via Coolify (Docker).

## Recent Updates (v3.0.0)

### Major Refactoring - Image Handling System

- ✅ **Cloudinary Integration**: Migrated from local file storage to Cloudinary cloud storage
- ✅ **New Image Services Architecture**: Created dedicated `imageServices/` directory with modular design
- ✅ **Dual Image Handling**: Support for both local storage and Cloudinary via configurable services
- ✅ **Automatic Image Processing**: Upload, resize, and optimize images with Sharp and Cloudinary transformations
- ✅ **Smart Image Deletion**: Automatic cleanup of old images on Cloudinary when updating/deleting records
- ✅ **Memory-based Upload**: Multer configured with memory storage for seamless Cloudinary uploads

### Image Services Structure

- ✅ **cloudinary-image.image.js**: Full Cloudinary integration with upload/update/delete operations
- ✅ **image.image.js**: Local file storage fallback (for development or self-hosted deployments)
- ✅ **Resource-specific services**: Separate image handlers for users and categories
- ✅ **Centralized Configuration**: Cloudinary config in `config/cloudinary.config.js`

### Middleware & Logging Updates

- ✅ **Enhanced Request Logging**: Improved Morgan logging middleware with better formatting
- ✅ **Package Metadata**: Updated author and version information
- ✅ **Multer Version Update**: Upgraded to multer 2.0.2 for better stability

### Security Enhancements

- ✅ **Fixed trust proxy vulnerability**: Changed from `trust proxy: true` to `trust proxy: 1`
- ✅ **Rate limiting compatibility**: Works correctly behind Coolify's Traefik proxy
- ✅ **IP-based rate limiting**: Properly identifies client IPs via `X-Forwarded-For`

### Bug Fixes & Cleanup

- ✅ Removed unused category image files from old local storage system
- ✅ Cleaned up debug logs from error controller
- ✅ Fixed image path handling and deletion logic
- ✅ Removed sensitive tokens from repository

## Features

- **Authentication & Authorization**: JWT-based authentication with secure cookie handling
- **Cloud Image Handling**: Cloudinary integration with automatic upload, resize, and deletion
- **Flexible Image Storage**: Choose between Cloudinary (cloud) or local file storage
- **Email Service**: Template-based email system using Pug templates and Nodemailer
- **Security**: Helmet, XSS protection, rate limiting, data sanitization, HPP protection
- **Validation**: Express-validator middleware for request validation (configured but not currently used)
- **Database**: MongoDB with Mongoose ODM and custom counter plugin
- **MVC Architecture**: Clean separation of concerns with modular design
- **Error Handling**: Global error handler with custom error classes
- **API Features**: Filtering, sorting, pagination, field limiting
- **Code Quality**: ESLint and Prettier configuration
- **CI/CD**: GitHub Actions + Coolify API for automated Docker redeploys
- **Compression**: Response compression for better performance
- **CORS**: Cross-Origin Resource Sharing support
- **Logging**: Morgan HTTP request logger with enhanced formatting

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: >= 18.0.0 (specified in `.nvmrc`: 22.14.0)
- **MongoDB**: Latest version
- **npm** or **pnpm** package manager

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd express
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=1234
DATABASE=your_mongodb_connection_string
DATABASE_PASSWORD=your_database_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_min_32_chars
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Email Configuration
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_password
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_FROM=noreply@yourdomain.com

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_UPLOAD_PRESET=your_app_name
```

## Running the Project

**Development mode:**

```bash
npm run dev
```

**Production mode:**

```bash
npm run start:prod
```

**Debug mode:**

```bash
npm run debug
```

The server will start on `http://localhost:1234` by default.

## Project Structure

```
express/
├── .github/
│   └── workflows/
│       └── node.js.yml          # CI/CD workflow for demo/prod deployment
├── config/
│   └── cloudinary.config.js     # Cloudinary configuration
├── controllers/
│   ├── authController.js        # Authentication logic
│   ├── errorController.js       # Global error handler
│   ├── globalFactory.js         # Global factory functions
│   ├── handlerFactory.js        # Generic CRUD handlers
│   ├── _categoryController.js   # Category controller (example)
│   ├── _sectionController.js    # Section controller (example)
│   └── _userController.js       # User controller
├── imageServices/
│   ├── config/
│   │   ├── cloudinary-image.image.js  # Cloudinary image service
│   │   └── image.image.js             # Local file storage service
│   ├── category.image.js        # Category image handling
│   └── user.image.js            # User image handling
├── middleware/
│   └── validateMiddleware.js    # Request validation middleware (not currently used)
├── models/
│   ├── plugins/
│   │   └── counterPlugin.js     # Auto-increment document numbers
│   ├── categoryModel.js         # Category schema
│   ├── sectionModel.js          # Section schema
│   └── userModel.js             # User schema with auth
├── public/
│   └── images/
│       ├── categories/          # Category images (local storage fallback)
│       └── users/               # User profile images (local storage fallback)
├── routes/
│   ├── categoryRoutes.js        # Category API routes
│   ├── sectionRoutes.js         # Section API routes
│   └── userRoutes.js            # User & auth routes
├── utils/
│   ├── apiFeatures.js           # Query features (filter, sort, paginate)
│   ├── appError.js              # Custom error class
│   ├── catchAsync.js            # Async error wrapper
│   ├── email.js                 # Email service class
│   ├── logger.js                # Logging utility
│   └── sendMail.js              # Email sender utility
├── views/
│   └── email/
│       ├── _style.pug           # Email styles
│       ├── baseEmail.pug        # Base email template
│       ├── passwordReset.pug    # Password reset email
│       └── welcome.pug          # Welcome email
├── .eslintrc.json               # ESLint configuration
├── .nvmrc                       # Node version specification
├── app.js                       # Express app configuration
├── Dockerfile                   # Coolify build configuration
├── package.json                 # Project dependencies
├── README.md                    # Documentation
└── server.js                    # Server entry point
```

## Technologies Used

### Core Dependencies

- **Express.js**: ^4.21.2 - Web application framework
- **MongoDB & Mongoose**: ^8.12.1 - Database and ODM with transaction support
- **dotenv**: ^16.4.7 - Environment variable management

### Authentication & Security

- **jsonwebtoken**: ^9.0.2 - JWT authentication
- **bcryptjs**: ^2.4.3 - Password hashing
- **express-rate-limit**: ^7.5.0 - API rate limiting
- **helmet**: ^8.0.0 - Security HTTP headers
- **express-mongo-sanitize**: ^2.2.0 - NoSQL injection prevention
- **hpp**: ^0.2.3 - HTTP parameter pollution protection
- **cors**: ^2.8.5 - Cross-Origin Resource Sharing

### File Handling & Email

- **cloudinary**: ^2.8.0 - Cloud-based image storage and transformation
- **multer**: 2.0.2 - Multipart form data / file upload
- **sharp**: ^0.33.5 - High-performance image processing
- **uuid**: ^13.0.0 - Unique identifier generation
- **nodemailer**: ^6.10.0 - Email sending
- **pug**: ^3.0.3 - Template engine for emails
- **html-to-text**: ^9.0.5 - HTML to plain text conversion

### Validation & Utilities

- **express-validator**: ^7.0.1 - Request validation middleware
- **validator**: ^13.12.0 - String validation and sanitization
- **compression**: ^1.8.0 - Response compression middleware
- **morgan**: ^1.10.0 - HTTP request logger

### Dev Dependencies

- **eslint**: ^8.57.1 - Code linting
- **eslint-config-airbnb-base**: ^15.0.0 - Airbnb style guide
- **eslint-config-prettier**: ^9.1.0 - Prettier compatibility
- **eslint-plugin-import**: ^2.29.1 - ES6+ import/export linting
- **eslint-plugin-node**: ^11.1.0 - Node.js specific rules
- **eslint-plugin-prettier**: ^5.1.3 - Prettier integration
- **prettier**: ^3.2.5 - Code formatting

## Available Scripts

```bash
npm start              # Start production server
npm run dev            # Start development server with nodemon
npm run start:prod     # Start production server with NODE_ENV=production
npm run debug          # Start server with ndb debugger
npm run build          # Build public assets
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting
npm run lint           # Lint code with ESLint
npm run lint:fix       # Fix linting issues automatically
```

## Key Features

### 1. Advanced Image Handling System with Cloudinary

The project includes a sophisticated cloud-based image handling system:

**Architecture:**

- **Resource-specific handlers**: Separate image services for users, categories, etc.
- **Modular design**: Located in `imageServices/` directory with configurable backends
- **Dual storage support**: Switch between Cloudinary (cloud) and local file storage

**Cloudinary Integration** (`imageServices/config/cloudinary-image.image.js`):

- **Cloud storage**: Images stored on Cloudinary CDN
- **Automatic upload**: Memory-based multer upload to Cloudinary
- **Image transformations**: Resize, crop, and optimize with Cloudinary's transformation API
- **Smart deletion**: Automatically removes old images from Cloudinary when updating/deleting records
- **Public ID extraction**: Intelligent URL parsing for image management
- **Error handling**: Robust error handling with fallback mechanisms

**Local Storage Fallback** (`imageServices/config/image.image.js`):

- **Development friendly**: Local file storage for development environments
- **Self-hosted option**: No external dependencies for image storage
- **Sharp processing**: Image resizing and optimization with Sharp library

**Features:**

- Multiple image field support (single or array)
- Configurable image dimensions and quality per field
- Transaction-safe database operations
- Automatic cleanup of old images on update/delete
- Memory-efficient buffer-based uploads

**Configuration:**
Each resource (user, category) has its own image service configuration in files like:

- [imageServices/user.image.js](imageServices/user.image.js)
- [imageServices/category.image.js](imageServices/category.image.js)

### 2. Counter Plugin

Custom Mongoose plugin (`models/plugins/counterPlugin.js`) that:

- Automatically generates sequential document numbers
- Handles race conditions with retry logic
- Provides counter reset functionality
- Ensures unique document numbering across collections

### 3. Validation Middleware (Available but Not Currently Integrated)

Express-validator based middleware (`middleware/validateMiddleware.js`) is configured but not currently used in routes:

- Ready-to-use validation chains for authentication (signup, login)
- User profile update validation
- Category creation and update validation
- Can be easily integrated into route handlers when needed

**Note:** This middleware is available in the codebase but routes currently don't implement it. To use it, import the validation chains and add them to your route definitions.

### 4. Handler Factory

Generic CRUD operation handlers (`controllers/handlerFactory.js`) that:

- Reduce code duplication
- Provide consistent API responses
- Support advanced query features (filtering, sorting, pagination)
- Handle errors uniformly

### 5. API Features

The `utils/apiFeatures.js` utility provides:

- **Filtering**: Query by any field with operators (gt, gte, lt, lte)
- **Sorting**: Sort by one or multiple fields
- **Field Limiting**: Select specific fields to return
- **Pagination**: Page-based result pagination

### 6. Email System

Template-based email system using Pug templates:

- Welcome emails
- Password reset emails
- HTML and plain text versions
- Responsive email design
- Custom styling support

### 7. Security Features

Comprehensive security implementation with production-ready configurations:

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds
- **Rate Limiting**: Prevent brute force attacks (100 req/hour per IP)
  - `trust proxy: 1` so `X-Forwarded-For` from Coolify's Traefik is honored
  - Real client IPs identified correctly behind the reverse proxy
- **Helmet**: Security HTTP headers with Content Security Policy
  - XSS Protection
  - Frame Options (DENY)
  - Content-Type Options (nosniff)
  - Referrer Policy (strict-origin-when-cross-origin)
- **CORS**: Configurable cross-origin resource sharing
  - Production: Restricted to `FRONTEND_URL`
  - Development: Open for testing
- **Data Sanitization**: NoSQL injection prevention with express-mongo-sanitize
- **HPP Protection**: HTTP parameter pollution prevention
- **Input Validation**: Express-validator middleware for request validation
- **Proxy Security**: Correctly configured to trust Coolify's Traefik reverse proxy

### 8. CI/CD Pipeline

Root workflow [.github/workflows/deploy.yml](../../.github/workflows/deploy.yml):

- Triggered on push to `main` when `apps/server/**` or `pnpm-lock.yaml` changes
- Runs on GitHub-hosted runners (Ubuntu)
- Calls Coolify API to redeploy `elshatory-api` (UUID is wired in the workflow)
- No self-hosted runner, no PM2 — Coolify rebuilds the Docker image and rolls it out

## Development

### Code Quality Tools

The project is configured with:

- **ESLint**: Airbnb style guide with Prettier integration
- **Prettier**: Consistent code formatting
- **Nodemon**: Auto-restart on file changes

### Environment Setup

1. Use the specified Node.js version:

```bash
nvm use
# or manually install Node.js 22.14.0
```

2. Configure your editor to use ESLint and Prettier

3. Install dependencies with your preferred package manager

## API Documentation

### Authentication Endpoints

- `POST /api/v1/users/signup` - Register a new user
- `POST /api/v1/users/login` - Login user
- `POST /api/v1/users/forgotPassword` - Request password reset
- `PATCH /api/v1/users/resetPassword/:token` - Reset password with token
- `GET /api/v1/users/logout` - Logout user

### Protected Routes (Require Authentication)

- `PATCH /api/v1/users/updateMyPassword` - Update current user password
- `GET /api/v1/users/me` - Get current user profile
- `PATCH /api/v1/users/updateMe` - Update current user data
- `DELETE /api/v1/users/deleteMe` - Deactivate account

### Category Routes

- `GET /api/v1/categories` - Get all categories (with filtering, sorting, pagination)
- `POST /api/v1/categories` - Create new category (with image upload)
- `GET /api/v1/categories/:id` - Get category by ID
- `PATCH /api/v1/categories/:id` - Update category (with image upload)
- `DELETE /api/v1/categories/:id` - Delete category

### Section Routes

- `GET /api/v1/sections` - Get all sections
- `POST /api/v1/sections` - Create new section
- `GET /api/v1/sections/:id` - Get section by ID
- `PATCH /api/v1/sections/:id` - Update section
- `DELETE /api/v1/sections/:id` - Delete section

### Query Parameters

All GET endpoints support advanced querying:

```
# Filtering
GET /api/v1/categories?name=Technology&active=true

# Filtering with operators
GET /api/v1/categories?price[gte]=100&price[lt]=500

# Sorting
GET /api/v1/categories?sort=name,-createdAt

# Field limiting
GET /api/v1/categories?fields=name,description,image

# Pagination
GET /api/v1/categories?page=2&limit=10
```

## Deployment

Deployed to [elshatory-api.beingmomen.com](https://elshatory-api.beingmomen.com) via Coolify on a self-hosted VPS. Coolify builds the Docker image from `apps/server/Dockerfile` and runs it behind Traefik (which terminates SSL via Let's Encrypt).

### Automated Flow

```
git push → GitHub Actions detects apps/server/** change
        → curl Coolify deploy API (UUID + bearer token)
        → Coolify pulls repo, builds Dockerfile, swaps container
```

Workflow lives at the monorepo root: [.github/workflows/deploy.yml](../../.github/workflows/deploy.yml). It runs on GitHub-hosted Ubuntu runners — no self-hosted runner required.

### Required Environment Variables (set in Coolify dashboard)

```env
NODE_ENV=production
PORT=1234
DATABASE_ATLAS=mongodb+srv://...      # MongoDB Atlas connection string
JWT_SECRET=<64-byte hex>
JWT_EXPIRES_IN=5h
JWT_COOKIE_EXPIRES_IN=5
EMAIL_FROM=noreply@yourdomain.com
STAMP_MAIL=your@gmail.com
STAMP_PASSWORD=<gmail app password>
FRONTEND_URL=https://elshatory-web.beingmomen.com
CLOUDINARY_CLOUD_NAME=<...>
CLOUDINARY_API_KEY=<...>
CLOUDINARY_API_SECRET=<...>
CLOUDINARY_UPLOAD_PRESET=<...>
APP_NAME=<...>
MANAGER=<...>
```

### Manual Redeploy

If GitHub Actions is unavailable, trigger a redeploy directly:

```bash
curl -X GET \
  "https://coolify.beingmomen.com/api/v1/deploy?uuid=<APP_UUID>&force=false" \
  -H "Authorization: Bearer $COOLIFY_ACCESS_TOKEN"
```

## Troubleshooting

### Coolify Deployment Issues

#### Deploy doesn't trigger after push

1. Verify the changed paths actually match `apps/server/**` or `pnpm-lock.yaml` in [.github/workflows/deploy.yml](../../.github/workflows/deploy.yml)
2. Check the workflow run on GitHub — if it ran and the curl step succeeded, the issue is downstream in Coolify
3. View deployment logs in the Coolify dashboard for `elshatory-api`

#### Build fails inside Coolify

- Confirm the Dockerfile path in the Coolify app matches `apps/server/Dockerfile`
- Ensure all required env vars are set as **build-time** in Coolify (not only runtime) if the Dockerfile uses them at build
- Check VPS RAM — Nuxt builds for `apps/client` / `apps/db` running in parallel can OOM the server

#### Trust Proxy Rate Limiting Error

**Problem**: `ERR_ERL_PERMISSIVE_TRUST_PROXY` validation error.

**Solution**: `app.js` uses `trust proxy: 1` (not `true`) so only Coolify's Traefik proxy is trusted. Do not change this to `true` — it would allow IP spoofing via forged `X-Forwarded-For` headers.

### MongoDB Connection Issues

```bash
# Check if MongoDB is running (local development)
mongosh

# Verify connection string in .env
DATABASE=mongodb://localhost:27017/your-database

# For MongoDB Atlas (production)
DATABASE_ATLAS=mongodb+srv://username:<password>@cluster.mongodb.net/database
```

**Common Issues**:

- **IP Whitelist**: Whitelist the Coolify VPS IP (or `0.0.0.0/0` if static IP isn't fixed) in MongoDB Atlas
- **Timeout**: Increase `serverSelectionTimeoutMS` if connection is slow on cold container starts

### Rate Limiting Issues

**Problem**: Rate limiting not working correctly behind proxy.

**Cause**: Incorrect trust proxy configuration.

**Solution**: Use the current configuration in [app.js](app.js):

```javascript
app.set('trust proxy', 1); // Trust first proxy

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
  validate: { trustProxy: false } // Skip strict validation
});
```

### Image Upload Issues

**Using Cloudinary (Default):**

- Verify Cloudinary environment variables are set correctly
- Check Cloudinary dashboard for upload activity
- Ensure `CLOUDINARY_UPLOAD_PRESET` folder exists or remove folder restrictions
- Check API key permissions in Cloudinary settings
- Review network connectivity to Cloudinary API

**Using Local Storage (Fallback):**

- Switch image service import in `imageServices/user.image.js` or `imageServices/category.image.js`
- Change from `require('./config/cloudinary-image.image')` to `require('./config/image.image')`
- Ensure `public/images/` directories exist
- Check file permissions (755 for directories, 644 for files)
- Verify multer and sharp are installed correctly
- **Docker Note**: Files written to the local filesystem are lost on container rebuild — use Cloudinary in production

### Email Not Sending

- Verify SMTP credentials in environment variables
- Check firewall/network settings
- Test with a service like Mailtrap for development
- Ensure `EMAIL_FROM` matches your SMTP provider's verified sender

### Port Already in Use

```bash
# Find process using port 1234
lsof -i :1234  # macOS/Linux
netstat -ano | findstr :1234  # Windows

# Kill the process or change PORT in .env
PORT=3000
```

### Build or Linting Errors

```bash
# Fix linting issues automatically
npm run lint:fix

# Check code formatting
npm run format:check

# Format all files
npm run format
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the Airbnb JavaScript style guide
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Run linting before committing: `npm run lint:fix`

## License

This project is licensed under the ISC License.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## Acknowledgments

- Built with Express.js and MongoDB
- Uses Airbnb JavaScript style guide
- Image handling inspired by modern image processing best practices
- Security implementations following OWASP guidelines

## Author

**beingmomen**

---

**Note**: This is a template project. Remember to:

- Update repository URLs
- Configure your own MongoDB instance
- Set up proper environment variables
- Review and customize security settings for production
- Remove example controllers (prefixed with `_`) if not needed
