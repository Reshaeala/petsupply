import axios from "axios";

const BASE_URL = "http://localhost:4000/api/cart";

export const addToCart = async (productId: number, quantity: number) => {
  const response = await axios.post(`${BASE_URL}/add`, { productId, quantity });
  return response.data;
};
