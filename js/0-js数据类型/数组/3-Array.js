const names = Array.of("Alice", "A", "asd", "sdas", "AAA");
names.forEach((item, index) => {
  console.log(item, index);
  if (item === "A") {
    return;
  }
});
