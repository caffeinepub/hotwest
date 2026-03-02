import Map "mo:core/Map";
import Float "mo:core/Float";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Order "mo:core/Order";
import Principal "mo:core/Principal";



actor {
  // Types
  type Category = {
    #electronics;
    #fashion;
    #homeKitchen;
    #sports;
    #beauty;
    #toys;
  };

  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    originalPrice : Float;
    imageUrl : Text;
    category : Category;
    inStock : Bool;
    rating : Float;
    reviewCount : Nat;
  };

  public type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };

    public func compareByRating(a : Product, b : Product) : Order.Order {
      Float.compare(b.rating, a.rating);
    };
  };

  // Storage
  let products = Map.empty<Nat, Product>();
  let carts = Map.empty<Principal, List.List<CartItem>>();
  let productIdCounter = Map.empty<Nat, ()>();

  // Categories
  let allCategories = [#electronics, #fashion, #homeKitchen, #sports, #beauty, #toys];

  // Add product
  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (products.containsKey(product.id)) {
      Runtime.trap("Product already exists");
    };
    products.add(product.id, product);
    productIdCounter.add(product.id, ());
  };

  // Update product
  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not products.containsKey(product.id)) {
      Runtime.trap("Product does not exist");
    };
    products.add(product.id, product);
  };

  // Delete product
  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    products.remove(id);
    productIdCounter.remove(id);
  };

  // Get single product
  public query ({ caller }) func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (?product) { product };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  // Get all products
  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  // Get products by category
  public query ({ caller }) func getProductsByCategory(category : Category) : async [Product] {
    products.values().toArray().sort().filter(
      func(product) {
        product.category == category;
      }
    );
  };

  // Get featured products (top rated)
  public query ({ caller }) func getFeaturedProducts() : async [Product] {
    let productArray = products.values().toArray();
    productArray.sort(Product.compareByRating);
  };

  // Add to cart
  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async () {
    let currentCart = switch (carts.get(caller)) {
      case (?cart) { cart };
      case (null) { List.empty<CartItem>() };
    };

    let updatedCart = List.empty<CartItem>();
    var found = false;

    // Check and update if product already exists in cart
    currentCart.forEach(
      func(item) {
        if (item.productId == productId) {
          found := true;
          updatedCart.add({
            productId;
            quantity = item.quantity + quantity;
          });
        } else {
          updatedCart.add(item);
        };
      }
    );

    if (not found) {
      updatedCart.add({ productId; quantity });
    };

    carts.add(caller, updatedCart);
  };

  // Remove from cart
  public shared ({ caller }) func removeFromCart(productId : Nat) : async () {
    switch (carts.get(caller)) {
      case (?cart) {
        let updatedCart = cart.filter(func(item) { item.productId != productId });
        carts.add(caller, updatedCart);
      };
      case (null) { Runtime.trap("Cart is empty") };
    };
  };

  // Update cart item quantity
  public shared ({ caller }) func updateCartItem(productId : Nat, quantity : Nat) : async () {
    switch (carts.get(caller)) {
      case (?cart) {
        let updatedCart = List.empty<CartItem>();
        cart.forEach(
          func(item) {
            if (item.productId == productId) {
              updatedCart.add({ productId; quantity });
            } else {
              updatedCart.add(item);
            };
          }
        );
        carts.add(caller, updatedCart);
      };
      case (null) { Runtime.trap("Cart is empty") };
    };
  };

  // Get cart items with product details
  public query ({ caller }) func getCart() : async [(CartItem, ?Product)] {
    switch (carts.get(caller)) {
      case (?cart) {
        let cartArray = cart.toArray();
        cartArray.map(
          func(item) {
            (item, products.get(item.productId));
          }
        );
      };
      case (null) { Runtime.trap("Cart is empty") };
    };
  };

  // Clear cart
  public shared ({ caller }) func clearCart() : async () {
    carts.remove(caller);
  };

  // Get cart total price
  public query ({ caller }) func getCartTotal() : async Float {
    var total : Float = 0;
    switch (carts.get(caller)) {
      case (?cart) {
        // Helper convert CartItem to Product (if exists)
        let cartArray = cart.toArray();
        cartArray.forEach(
          func(item) {
            switch (products.get(item.productId)) {
              case (?product) {
                total += product.price * item.quantity.toFloat();
              };
              case (null) {};
            };
          }
        );
      };
      case (null) {};
    };
    total;
  };

  // Get all categories
  public query ({ caller }) func getCategories() : async [Category] {
    allCategories;
  };

  // Initialize products
  public shared ({ caller }) func seedProducts() : async () {
    // Initialize only if empty
    if (products.isEmpty()) {
      let initialProducts = [
        {
          id = 1;
          name = "Wireless Headphones";
          description = "High quality wireless headphones with noise cancellation";
          price = 500.0;
          originalPrice = 1000.0;
          imageUrl = "";
          category = #electronics;
          inStock = true;
          rating = 4.7;
          reviewCount = 128;
        },
        {
          id = 2;
          name = "Classic Men's Watch";
          description = "Elegant analog watch with leather strap";
          price = 500.0;
          originalPrice = 1000.0;
          imageUrl = "";
          category = #fashion;
          inStock = true;
          rating = 4.3;
          reviewCount = 56;
        },
        {
          id = 3;
          name = "Smart Robot Vacuum";
          description = "Automatic vacuum cleaner for hard floors and carpets";
          price = 500.0;
          originalPrice = 1000.0;
          imageUrl = "";
          category = #homeKitchen;
          inStock = true;
          rating = 4.8;
          reviewCount = 212;
        },
        {
          id = 4;
          name = "Yoga Mat";
          description = "Non-slip eco-friendly yoga mat for exercise";
          price = 500.0;
          originalPrice = 1000.0;
          imageUrl = "";
          category = #sports;
          inStock = true;
          rating = 4.6;
          reviewCount = 98;
        },
        {
          id = 5;
          name = "Organic Facial Serum";
          description = "Hydrating serum for glowing skin";
          price = 500.0;
          originalPrice = 1000.0;
          imageUrl = "";
          category = #beauty;
          inStock = true;
          rating = 4.2;
          reviewCount = 67;
        },
        {
          id = 6;
          name = "Building Blocks Set";
          description = "Creative blocks for toddlers ages 3+";
          price = 500.0;
          originalPrice = 1000.0;
          imageUrl = "";
          category = #toys;
          inStock = true;
          rating = 4.9;
          reviewCount = 154;
        },
        {
          id = 7;
          name = "Bluetooth Speaker";
          description = "Portable speaker with high bass and long battery";
          price = 500.0;
          originalPrice = 1000.0;
          imageUrl = "";
          category = #electronics;
          inStock = true;
          rating = 4.5;
          reviewCount = 78;
        },
        {
          id = 8;
          name = "Fashion Sunglasses";
          description = "UV protected sunglasses for men & women";
          price = 500.0;
          originalPrice = 1000.0;
          imageUrl = "";
          category = #fashion;
          inStock = true;
          rating = 4.4;
          reviewCount = 31;
        },
      ];

      for (product in initialProducts.values()) {
        products.add(product.id, product);
        productIdCounter.add(product.id, ());
      };
    };
  };

  // Search products by name keyword
  public query ({ caller }) func searchProducts(keyword : Text) : async [Product] {
    products.values().toArray().sort().filter(func(product) { product.name.contains(#text keyword) });
  };
};
