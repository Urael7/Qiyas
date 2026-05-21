import { Router } from "express";
import { productList } from "../utils/productList.js";

const productRoute = Router();
productRoute.get("/api/products/:id", (request, response) => {
  const productId = parseInt(request.params.id, 10);
  if (Number.isNaN(productId))
    return response.status(400).send({ message: "Bad request" });
  const product = productList.find((product) => product.id === productId);
  if (!product) {
    return response.status(404).send({ message: "Product not found" });
  }
  return response.status(200).send(product);
});


productRoute.get("/api/products", (request, response) => {
  const { page = 1, limit = 10, type, productType, minPrice, maxPrice } = request.query;
  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  const safePage = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
  const safeLimit = Number.isNaN(parsedLimit) || parsedLimit < 1 ? 10 : parsedLimit;
  const typeFilter = (type || productType || "").toString().trim().toLowerCase();
  const min = parseFloat(minPrice);
  const max = parseFloat(maxPrice);

  let filteredProducts = [...productList];
  if (typeFilter) {
    filteredProducts = filteredProducts.filter(
      (product) => product.type?.toLowerCase() === typeFilter
    );
  }
  if (!Number.isNaN(min)) {
    filteredProducts = filteredProducts.filter((product) => product.price >= min);
  }
  if (!Number.isNaN(max)) {
    filteredProducts = filteredProducts.filter((product) => product.price <= max);
  }

  const totalCount = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / safeLimit));
  const startIndex = (safePage - 1) * safeLimit;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + safeLimit);

  return response.status(200).send({
    count: totalCount,
    page: safePage,
    limit: safeLimit,
    totalPages,
    filters: {
      type: typeFilter || null,
      minPrice: Number.isNaN(min) ? null : min,
      maxPrice: Number.isNaN(max) ? null : max,
    },
    data: paginatedProducts,
  });
});

export default productRoute;