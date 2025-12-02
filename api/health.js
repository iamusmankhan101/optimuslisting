module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    try {
        // Test if we can load the Neon module
        const { neon } = require('@neondatabase/serverless');
        
        // Test if DATABASE_URL exists
        const hasDbUrl = !!process.env.DATABASE_URL;
        
        res.status(200).json({
            success: true,
            message: 'API is working',
            neonLoaded: true,
            databaseUrlExists: hasDbUrl,
            nodeVersion: process.version
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            stack: error.stack
        });
    }
};
