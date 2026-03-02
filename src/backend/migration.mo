import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";

module {
  type OldProduct = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    originalPrice : Float;
    imageUrl : Text;
    category : {
      #electronics;
      #fashion;
      #homeKitchen;
      #sports;
      #beauty;
      #toys;
    };
    inStock : Bool;
    rating : Float;
    reviewCount : Nat;
  };

  type OldCartItem = {
    productId : Nat;
    quantity : Nat;
  };

  type OldActor = {
    products : Map.Map<Nat, OldProduct>;
    carts : Map.Map<Principal, List.List<OldCartItem>>;
    productIdCounter : Map.Map<Nat, ()>;
  };

  type NewProduct = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    originalPrice : Float;
    imageUrl : Text;
    category : {
      #electronics;
      #fashion;
      #homeKitchen;
      #sports;
      #beauty;
      #toys;
    };
    inStock : Bool;
    rating : Float;
    reviewCount : Nat;
  };

  type NewCartItem = {
    productId : Nat;
    quantity : Nat;
  };

  type NewActor = {
    products : Map.Map<Nat, NewProduct>;
    carts : Map.Map<Principal, List.List<NewCartItem>>;
    productIdCounter : Map.Map<Nat, ()>;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
