import { TrainlineController } from "./controller/TrainlineController"
import { UserController } from "./controller/UserController"
import { StationController } from "./controller/StationController"
import { TripRouteController } from "./controller/TripRouteController"
import { CardController } from "./controller/CardController"

export const Routes = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all"
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one"
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save"
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove"
}, {
    method: "get",
    route: "/trainlines",
    controller: TrainlineController,
    action: "all"
}, {
    method: "post",
    route: "/trainlines",
    controller: TrainlineController,
    action: "save"
}, {
    method: "get",
    route: "/trainlines/:name",
    controller: TrainlineController,
    action: "one"
}, {
    method: "delete",
    route: "/trainlines/:name",
    controller: TrainlineController,
    action: "remove"
}, {
    method: "get",
    route: "/stations",
    controller: StationController,
    action: "all"
}, {
    method: "post",
    route: "/stations",
    controller: StationController,
    action: "save"
}, {
    method: "get",
    route: "/routeTrip",
    controller: TripRouteController,
    action: "routeTrip"
}, {
    method: "get",
    route: "/card",
    controller: CardController,
    action: "allCards"
}, {
    method: "get",
    route: "/card/:uuid",
    controller: CardController,
    action: "getCard"
},
{
    method: "post",
    route: "/card/new",
    controller: CardController,
    action: "newCard"
},
{
    method: "post",
    route: "/card/update",
    controller: CardController,
    action: "updateCardBalance"
}
]