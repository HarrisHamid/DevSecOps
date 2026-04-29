// Polyfill Web APIs that react-router-dom v7 needs but older jsdom doesn't provide
const { TextEncoder, TextDecoder } = require('util')
Object.assign(globalThis, { TextEncoder, TextDecoder })
