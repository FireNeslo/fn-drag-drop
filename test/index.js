var WebDriver = require('selenium-webdriver');
var driver = WebDriver.Builder()
  .withCapabilities(webdriver.Capabilities.chrome())
  .build();

var DragAndDrop = require('../index')

var item = document.createElement('li')

var source = document.createElement('ul')
var target = document.createElement('ol')

var dragAndDrop = new Actions(driver)
  .clickAndHold(item)
  .moveToElement(target)
  .release(item)
  .build();

dragAndDrop.perform();
