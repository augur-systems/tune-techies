const path = require('path')

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src') // Adjust based on your project structure
    return config
  },
}

module.exports = nextConfig
