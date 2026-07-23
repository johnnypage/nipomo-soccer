import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/use-cart";
import { ActiveKidProvider } from "@/hooks/use-active-kid";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Reign from "@/pages/Reign";
import Rise from "@/pages/Rise";
import RootsPage from "@/pages/roots";
import RootsParentAndMe from "@/pages/roots/ParentAndMe";
import RootsRecreational from "@/pages/roots/Recreational";
import FindMyDivision from "@/pages/FindMyDivision";
import Volunteer from "@/pages/Volunteer";
import Compare from "@/pages/Compare";
import Shop from "@/pages/Shop";
import OrderConfirmation from "@/pages/OrderConfirmation";
import Admin from "@/pages/Admin";
import CoachWithUs from "@/pages/CoachWithUs";
import TeamPlacement from "@/pages/TeamPlacement";
import ChallengeHub from "@/pages/challenge/index";
import ChallengeSignup from "@/pages/challenge/signup";
import Leaderboard from "@/pages/challenge/leaderboard";
import PlayerProfile from "@/pages/challenge/player";
import CopaDeCostaComingSoon from "@/pages/CopaDeCostaComingSoon";
import FallLanding from "@/pages/landing/FallLanding";
import FutbolLanding from "@/pages/landing/FutbolLanding";
import Privacy from "@/pages/legal/privacy";
import Terms from "@/pages/legal/terms";
import ParticipationAgreement from "@/pages/legal/participation-agreement";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/reign" component={Reign} />
      <Route path="/rise" component={Rise} />
      <Route path="/roots" component={RootsPage} />
      <Route path="/roots/parent-and-me" component={RootsParentAndMe} />
      <Route path="/roots/recreational" component={RootsRecreational} />
      <Route path="/roots/5v5">{() => <Redirect to="/fall" />}</Route>
      <Route path="/find-my-division" component={FindMyDivision} />
      <Route path="/volunteer" component={Volunteer} />
      <Route path="/about/compare" component={Compare} />
      <Route path="/coach" component={CoachWithUs} />
      <Route path="/shop" component={Shop} />
      <Route path="/order-confirmation" component={OrderConfirmation} />
      <Route path="/team-placement" component={TeamPlacement} />
      <Route path="/admin" component={Admin} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/participation-agreement" component={ParticipationAgreement} />
      <Route path="/challenge" component={ChallengeHub} />
      <Route path="/challenge/signup" component={ChallengeSignup} />
      <Route path="/challenge/leaderboard" component={Leaderboard} />
      <Route path="/challenge/player/:id" component={PlayerProfile} />
      <Route path="/copa-de-costa" component={CopaDeCostaComingSoon} />
      <Route path="/fall" component={FallLanding} />
      <Route path="/futbol" component={FutbolLanding} />
      <Route path="/5v5">{() => <Redirect to="/fall" />}</Route>
      <Route path="/tournament">{() => <Redirect to="/" />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <ActiveKidProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ActiveKidProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
