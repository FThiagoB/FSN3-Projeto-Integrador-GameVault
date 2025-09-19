import products from "../../data/products";

export default function randomizerGames() {
  const index = Math.floor(Math.random() * products.length);
  return products[index];
}
