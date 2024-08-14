# 🚀 Welcome to Your New Nuetrix Script

This project is a React application bundled using Webpack into a single JavaScript file. The bundled file can be integrated into any website via a script tag.

## Objective

The goal of this repository is to provide a React application that can be easily bundled into a single JavaScript file using Webpack, allowing for seamless integration into any website.

## Features

- **React Application:** Provides a React-based user interface.
- **Webpack Bundling:** Bundles the React application into a single JavaScript file for easy integration into web pages.

## Setup

### Prerequisites

- Node.js 20 or higher

### Installation

Install the project dependencies using Yarn or NPM:

```bash
yarn install
```

### Build and Deploy

To bundle your application:

```bash
yarn build
```

This command will bundle the React application into a single JavaScript file.

### To start your application locally:

To bundle your application:

```bash
yarn start
```

This will start the development server and serve the application locally.

### Integration

After building the project, the output JavaScript file can be integrated into any website by including it as a script tag:

```bash
<script async defer src="http://localhost:8080/neutrix.js?siteId=123123123"></script>
```

### Integration

1. Script Injection:
   The application expects to be included on a website via a script tag. It retrieves the siteId from the script's URL query parameters to configure the app.

2. Application Initialization:
   The App component is rendered into a dynamically created div with an id of root. The siteId parameter is passed to the App component, allowing it to function based on the specific site.
