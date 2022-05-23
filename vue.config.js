module.exports = {
    outputDir: 'dist/dist',
	assetsDir: 'assets',
	devServer: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:3000/',
                changeOrigin: true
            }
        }
    }
}