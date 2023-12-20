module.exports = {
    /**
    * Application configuration section
    * http://pm2.keymetrics.io/docs/usage/application-declaration/
    */
    apps : [
        // First application
        {
            name      : 'APD-Server',
            script    : 'apdapp.js',
            instances : '1',
            exec_mode : "cluster",
            log_date_format : "YYYY-MM-DD HH:mm:ss SSS",
            env: {
                NODE_ENV: 'dev'
            },
            env_dev: {
                NODE_ENV: 'dev'
            }
        }
    ]
};