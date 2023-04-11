import { TrainlineController } from "./controller/TrainlineController"
import { StationController } from "./controller/StationController"
import { TripRouteController } from "./controller/TripRouteController"
import { CardController } from "./controller/CardController"
import { TransactionController } from "./controller/TransactionController"

export const Routes = [{
    method: "get",
    route: "/trainlines",
    controller: TrainlineController,
    action: "allTrainlines"
}, {
    method: "post",
    route: "/trainlines",
    controller: TrainlineController,
    action: "newLine"
}, {
    method: "get",
    route: "/trainlines/:name",
    controller: TrainlineController,
    action: "getTrainline"
}, {
    method: "get",
    route: "/stations",
    controller: StationController,
    action: "all"
}, {
    method: "post",
    route: "/train-line",
    controller: StationController,
    action: "newTrainline"
}, {
    method: "post",
    route: "/station/:station/enter",
    controller: StationController,
    action: "enter"
}, {
    method: "post",
    route: "/station/:station/exit",
    controller: StationController,
    action: "exit"
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
    route: "/card",
    controller: CardController,
    action: "card"
},
{
    method: "post",
    route: "/card/update",
    controller: CardController,
    action: "updateCardBalance"
},
{
    method: "get",
    route: "/transaction",
    controller: TransactionController,
    action: "allTransactions"
}
]