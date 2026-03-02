import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CartItem {
    productId: bigint;
    quantity: bigint;
}
export interface Product {
    id: bigint;
    inStock: boolean;
    originalPrice: number;
    name: string;
    description: string;
    imageUrl: string;
    category: Category;
    rating: number;
    price: number;
    reviewCount: bigint;
}
export enum Category {
    toys = "toys",
    homeKitchen = "homeKitchen",
    beauty = "beauty",
    sports = "sports",
    fashion = "fashion",
    electronics = "electronics"
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    addToCart(productId: bigint, quantity: bigint): Promise<void>;
    clearCart(): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getCart(): Promise<Array<[CartItem, Product | null]>>;
    getCartTotal(): Promise<number>;
    getCategories(): Promise<Array<Category>>;
    getFeaturedProducts(): Promise<Array<Product>>;
    getProduct(id: bigint): Promise<Product>;
    getProductsByCategory(category: Category): Promise<Array<Product>>;
    removeFromCart(productId: bigint): Promise<void>;
    searchProducts(keyword: string): Promise<Array<Product>>;
    seedProducts(): Promise<void>;
    updateCartItem(productId: bigint, quantity: bigint): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
