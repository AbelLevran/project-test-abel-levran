const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy API requests to the backend server
app.use('/api', createProxyMiddleware({
    target: 'https://suitmedia-backend.suitdev.com', // API backend
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/api',
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request: ${req.method} ${req.originalUrl}`);
        proxyReq.setHeader('Accept', 'application/json');
        proxyReq.setHeader('Content-Type', 'application/json');
    }
}));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
