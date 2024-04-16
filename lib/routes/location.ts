import { Application, Request, Response } from 'express';
import { LocationController } from '../controllers/locationController';

export class LocationRoutes {

    private location_controller: LocationController = new LocationController();

    public route(app: Application) {
        
        app.post('/location', (req: Request, res: Response) => {
            this.location_controller.createLocation(req, res);
        });

        app.get('/location', (req: Request, res: Response,) => {
            this.location_controller.getAll(req, res);
           
        });

        app.get('/location/:id', (req: Request, res: Response) => {
            this.location_controller.getLocation(req, res);
        });

        app.put('/location/:id', (req: Request, res: Response) => {
            this.location_controller.updateLocation(req, res);
        });

        app.delete('/location/:id', (req: Request, res: Response) => {
            this.location_controller.deleteLocation(req, res);
        });

    }
}