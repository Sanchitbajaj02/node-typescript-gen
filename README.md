# create-express-app

A CLI tool to quickly create Express TypeScript applications with a well-structured template.

## Features

- 🚀 Quick project setup with interactive prompts
- 📁 Well-organized project structure
- 🔧 Pre-configured with essential middleware and utilities
- 📝 TypeScript support out of the box
- 🛡️ Built-in security features (rate limiting, XSS protection)
- 📊 Logging with Winston
- 🔄 Hot reload for development
- 🎯 Dependency injection container
- ⚡ Error handling middleware

## Installation

### Global Installation

```bash
npm install -g create-express-app
```

### Local Usage (npx)

```bash
npx create-express-app my-app
```

## Usage

### Basic Usage

```bash
create-express-app my-app
```

This will prompt you for:
- Project name (defaults to the provided name)
- Project description
- Author name
- Version number
- Whether to install dependencies automatically

### Interactive Mode

If you don't provide a project name, the CLI will guide you through all options:

```bash
create-express-app
```

## What Gets Created

The CLI creates a complete Express TypeScript application with the following structure:

```
my-app/
├── src/
│   ├── app.factory.ts      # Application factory
│   ├── config/            # Configuration files
│   │   ├── app.config.ts
│   │   └── database.config.ts
│   ├── container/         # Dependency injection container
│   │   └── di.container.ts
│   ├── lib/              # Utility libraries
│   │   ├── app-assert.ts
│   │   ├── async-handler.ts
│   │   ├── custom-error.ts
│   │   └── rate-limit.ts
│   ├── logger/           # Logging configuration
│   │   ├── logger.config.ts
│   │   └── logger.service.ts
│   ├── middleware/       # Express middleware
│   │   ├── error-handler.ts
│   │   ├── morgan-middleware.ts
│   │   └── service-protection.ts
│   ├── types/           # TypeScript type definitions
│   │   ├── database.types.ts
│   │   └── protection.types.ts
│   └── server.ts        # Server entry point
├── .env                 # Environment variables
├── package.json         # Project configuration
├── tsconfig.json        # TypeScript configuration
└── README.md           # Project documentation
```

## Included Features

### Core Features
- **Express.js** with TypeScript
- **Dependency Injection** container for better code organization
- **Error Handling** middleware with custom error classes
- **Rate Limiting** to protect your API
- **Logging** with Winston for production-ready logging
- **CORS** support for cross-origin requests
- **XSS Protection** middleware
- **Environment Configuration** with dotenv

### Development Features
- **Hot Reload** with tsc-watch
- **TypeScript** configuration optimized for Node.js
- **Prettier** for code formatting
- **Module Aliases** for clean imports

### Production Features
- **Build Process** with TypeScript compilation
- **Production Server** configuration
- **Error Handling** for production environments
- **Security Middleware** enabled by default

## Getting Started

After creating your project:

```bash
cd my-app
npm install
npm run dev
```

Your server will start on `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm start` - Start production server
- `npm run format` - Format code with Prettier

## Configuration

The generated project includes several configuration files:

- **app.config.ts** - Application configuration
- **database.config.ts** - Database configuration (ready for your database)
- **logger.config.ts** - Logging configuration
- **.env** - Environment variables

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/yourusername/create-express-app/issues) on GitHub.

