import { AppDataSource } from '../src/data-source';
import { TripRouteController } from '../src/controller/TripRouteController';

describe('TripRouteController', () => {
    let tripRouteController = new TripRouteController();
    describe('optimalPath', () => {
        it('should return the optimal path', () => {
            const origin = 'station1';
            const destination = 'station5';
            const lines = {
                line1: ['station1', 'station2', 'station3', 'station4'],
                line2: ['station5', 'station6', 'station2', 'station7', 'station8']
            };
            const expectedPath = ['station1', 'station2', 'station6', 'station5'];

            const actualPath = tripRouteController.optimalPath(origin, destination, lines);

            expect(actualPath).toEqual(expectedPath);
        });
    });
});
