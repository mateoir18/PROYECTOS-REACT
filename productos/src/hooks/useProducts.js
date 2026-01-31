import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts debe usarse dentro de ProductProvider");
  }
  return context;
}
