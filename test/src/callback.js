function callback(func) {
  func("Hello");
}

function Test() {
  const hello = callback((message) => {
    console.log(message);
  });
}
