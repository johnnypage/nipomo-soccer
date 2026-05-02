import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/use-cart";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Reign from "@/pages/Reign";
import Rise from "@/pages/Rise";
import Compare from "@/pages/Compare";
import Shop from "@/pages/Shop";
import OrderConfirmation from "@/pages/OrderConfirmation";
import Admin from "@/pages/Admin";
import CoachWithUs from "@/pages/CoachWithUs";
import TeamPlacement from "@/pages/TeamPlacement";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/reign" component={Reign} />
      <Route path="/rise" component={Rise} />
      <Route path="/about/compare" component={Compare} />
      <Route path="/coach" component={CoachWithUs} />
      <Route path="/shop" component={Shop} />
      <Route path="/order-confirmation" component={OrderConfirmation} />
      <Route path="/team-placement" component={TeamPlacement} />
      <Route path="/admin" component={Admin} />
      <Route path="/tournament">{() => <Redirect to="/" />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
