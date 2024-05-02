import { Route } from "@angular/router";
import { AddSubscriptionComponent } from "./addSubscription/add-subscription/add-subscription.component";
import { AllSubscriptionsComponent } from "./addSubscription/all-subscriptions/all-subscriptions.component";
export const SUBSCRIPTION_ROUTE: Route[] = [
  {
    path: "",
    redirectTo: "main",
    pathMatch: "full",
  },
  {
    path: "add-subscription",
    component: AddSubscriptionComponent,
  },
  {
    path: "all-subscription",
    component: AllSubscriptionsComponent,
  },
];
