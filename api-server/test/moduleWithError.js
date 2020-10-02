//
// Function for logger testing purposes
//

function moduleWithError() {
  try {
    // Uncomment to test 'Node's unhandled rejection handler'
    let res = Promise.reject(new Error("fail"));
    // Uncomment to test this 'catch' block
    // throw new Error('Error text...');
  } catch (err) {
    console.error(
      `Cought error in 'try..catch' block: ${err.name} \n${err.stack}`,
    );
  }

  // Uncomment to test 'Node's uncaught exception handler'
  //throw new Error('Error text...');
}

module.exports.moduleWithError = moduleWithError;
