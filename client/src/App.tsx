import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Reign from "@/pages/Reign";
import Rise from "@/pages/Rise";
import Compare from "@/pages/Compare";
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/reign" component={Reign} />
      <Route path="/rise" component={Rise} />
      <Route path="/about/compare" component={Compare} />
      <Route path="/tournament">{() => <Redirect to="/" />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
