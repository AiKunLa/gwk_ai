function TestComponent() {
  const products = [
    { title: "Cabbage", id: 1 },
    { title: "Garlic", id: 2 },
    { title: "Apple", id: 3 },
  ];
  const listItems = products.map(product =>
    <li key={product.id}>
      {product.title}
    </li>
  );
  return (
    <div>
      <ul>{listItems}</ul>
    </div>
  );
}

export default TestComponent;
