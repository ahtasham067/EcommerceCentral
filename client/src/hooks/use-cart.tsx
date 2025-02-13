import { createContext, useContext, ReactNode, useReducer, useCallback } from "react";
import { CartItem, Product } from "@shared/schema";

type CartState = {
  items: CartItem[];
  total: number;
};

type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity: number }
  | { type: "REMOVE_ITEM"; productId: number }
  | { type: "UPDATE_QUANTITY"; productId: number; quantity: number }
  | { type: "CLEAR" };

type CartContextType = {
  items: CartItem[];
  total: number;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        item => item.productId === action.product.id
      );

      const items = existingItem
        ? state.items.map(item =>
            item.productId === action.product.id
              ? { ...item, quantity: item.quantity + action.quantity }
              : item
          )
        : [...state.items, { 
            productId: action.product.id, 
            quantity: action.quantity,
            product: action.product 
          }];

      return {
        items,
        total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      };
    }
    case "REMOVE_ITEM": {
      const items = state.items.filter(item => item.productId !== action.productId);
      return {
        items,
        total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      };
    }
    case "UPDATE_QUANTITY": {
      const items = state.items.map(item =>
        item.productId === action.productId
          ? { ...item, quantity: action.quantity }
          : item
      );
      return {
        items,
        total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      };
    }
    case "CLEAR":
      return { items: [], total: 0 };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  const addItem = useCallback((product: Product, quantity: number) => {
    dispatch({ type: "ADD_ITEM", product, quantity });
  }, []);

  const removeItem = useCallback((productId: number) => {
    dispatch({ type: "REMOVE_ITEM", productId });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        total: state.total,
        addItem,
        removeItem,
        updateQuantity,
        clear
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
