import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/store/home";
import ProductsPage from "@/pages/store/products";
import ProductPage from "@/pages/store/product";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProducts from "@/pages/admin/products";
import AdminOrders from "@/pages/admin/orders";
import { ProtectedRoute } from "./lib/protected-route";
import StoreLayout from "./components/layout/store-layout";
import AdminLayout from "./components/layout/admin-layout";

function Router() {
  return (
    <Switch>
      {/* Auth */}
      <Route path="/auth" component={AuthPage} />
      
      {/* Admin Routes */}
      <Route path="/admin">
        {() => (
          <AdminLayout>
            <ProtectedRoute path="/admin" component={AdminDashboard} />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/products">
        {() => (
          <AdminLayout>
            <ProtectedRoute path="/admin/products" component={AdminProducts} />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/orders">
        {() => (
          <AdminLayout>
            <ProtectedRoute path="/admin/orders" component={AdminOrders} />
          </AdminLayout>
        )}
      </Route>

      {/* Store Routes */}
      <Route path="/">
        {() => (
          <StoreLayout>
            <HomePage />
          </StoreLayout>
        )}
      </Route>
      <Route path="/products">
        {() => (
          <StoreLayout>
            <ProductsPage />
          </StoreLayout>
        )}
      </Route>
      <Route path="/products/:id">
        {(params) => (
          <StoreLayout>
            <ProductPage id={Number(params.id)} />
          </StoreLayout>
        )}
      </Route>

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router />
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
