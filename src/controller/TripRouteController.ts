import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { Station } from '../entity/Station'

interface StationNode {
    station: Station;
    distance: number;
}

//http://localhost:3000/routeTrip?origin=Houston&destination=23rd
export class TripRouteController {
    private stationRepository = AppDataSource.getRepository(Station)

    async routeTrip(request: Request, response: Response, next: NextFunction) {
        const { origin, destination } = request.query;
        try {
            const stations = await this.stationRepository.find();

            const originLines = stations
                .filter(station => station.name === origin)
                .map(station => station.trainlineName);
            const destinationLines = stations
                .filter(station => station.name === destination)
                .map(station => station.trainlineName);
            const routeLines = [...originLines, ...destinationLines];

            const possibleStations = {}
            routeLines.forEach(trainLine => {
                possibleStations[trainLine] = stations
                    .filter(station => station.trainlineName === trainLine)
                    .map(station => station.name);
            });
            const path = this.optimalPath(origin, destination, possibleStations);
            response.status(200).json(path);
        } catch (error) {
            next(error);
        }
    }

    optimalPath(origin: string, destination: string, lines: object) {
        let paths = [[origin]];
        let vistied = new Set<string>();
        while (paths) {
            const path = paths.shift();
            if (path[path.length - 1] === destination) {
                console.log("RETURN!!", path);
                return path;
            }
            for (const key in lines) {
                const line = lines[key];
                if (!line.includes(path[path.length - 1])) continue;
                const i = line.indexOf(path[path.length - 1])

                for (const station of line.slice(i - 1, i).concat(line.slice(i + 1, i + 2))) {

                    if (vistied.has(station)) continue;
                    paths.push([...path, station]);
                    vistied.add(station);
                }
            }
        }
        return [];
    }

}