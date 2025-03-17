// Karma configuration
// Generated on Thu Jan 16 2025 16:57:07 GMT-0500 (Eastern Standard Time)


module.exports = function (config) {
  config.set({
    browsers: ['ChromeHeadlessNoSandbox'],
    singleRun: true, // ✅ Ensures Karma exits after running tests
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu']
      }
    },
    reporters: ['progress'],
    autoWatch: false // ✅ Disable auto-watch mode
  });
};
