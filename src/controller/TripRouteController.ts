import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { Station } from '../entity/Station'
export class TripRouteController {
    private stationRepository = AppDataSource.getRepository(Station)

    async routeTrip(request: Request, response: Response, next: NextFunction) {
        /* Find the shortest route between two locations. Currently assuming that there will be only
        be on transfer between origin and destination. 'routeLines' can be expanded upon to handle more transfers.
        A map can be made for every line that are connected between the origin and destination lines */
        const { origin, destination } = request.query

        if (typeof origin !== 'string' || origin.trim().length === 0) return response.status(400).json({ error: 'Invalid origin parameter' });
        if (typeof destination !== 'string' || destination.trim().length === 0) return response.status(400).json({ error: 'Invalid destination parameter' });

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
            console.log(originLines, destinationLines);
            const path = this.optimalPath(origin, destination, possibleStations);
            response.status(200).json(path);
        } catch (error) {
            console.error('Error routing path between origin and destination: ', error);
            return response.status(500).json({ error: 'Error routing path between origin and destination' });
        }
    }

    optimalPath(origin: string, destination: string, lines: object) {
        let paths = [[origin]];
        let vistied = new Set<string>();
        while (paths) {
            const path = paths.shift();
            if (path[path.length - 1] === destination) {
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