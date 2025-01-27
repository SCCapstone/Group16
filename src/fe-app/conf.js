exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['./src/fe-app/src/app/login/behav_test_login.component.spec.ts'],
    capabilities: {
      'browserName': 'chrome',
      'chromeOptions': {
      args: ['--headless', '--disable-gpu', '--window-size=1920x1080']
      }
    }
  };