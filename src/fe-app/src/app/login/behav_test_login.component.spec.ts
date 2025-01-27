describe('AngularJS Application Health Check', function() {
  it('should verify Angular is functional', function() {
    // Wait for Angular to be ready
    browser.waitForAngular();

    // Check if Angular is bootstrapped by using angular.element
    var angularVersion = element(by.binding('angular.version.full')).getText();
    
    expect(angularVersion).toBeDefined(); // Ensure Angular version is defined
  });
});
