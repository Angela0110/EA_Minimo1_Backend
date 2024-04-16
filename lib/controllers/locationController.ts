import { Request, Response } from 'express';
import { ILocation } from '../models/locations/model';
import LocationService from '../models/locations/service';
import e = require('express');
import * as mongoose from 'mongoose';

export class LocationController {

    private location_service: LocationService = new LocationService();

    public async createLocation(req: Request, res: Response) {
        
        try{
            if (req.body.address.street && req.body.address.postalcode && req.body.address.city && req.body.activity) {
                const location_params: ILocation = {
                    address: {
                        street: req.body.address.street,
                        postalcode: req.body.address.postalcode,
                        city: req.body.address.city
                    },
                    activity: req.body.activity,
                };
                const location_data = await this.location_service.createLocation(location_params);
                return res.status(201).json({ message: 'Location created successfully', location: location_data });
            }else{            
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async getAll(req: Request, res: Response) {
        try {
            const location_filter = {};
            const location_data = await this.location_service.getAll(location_filter);
        
            return res.status(200).json(location_data);

        } catch (error) {
            
            console.error('Error en la solicitud:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    public async getLocation(req: Request, res: Response) {
        try{
            if (req.params.id) {
                const location_filter = { _id: req.params.id };
                const location_data = await this.location_service.populateLocationActivity(location_filter);
                // Send success response
                return res.status(200).json({ data: location_data, message: 'Successful'});
            } else {
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async updateLocation(req: Request, res: Response) {
        try {
            if (req.params.id) {
                const location_filter = { _id: req.params.id };
                // Fetch user
                const location_data = await this.location_service.filterLocation(location_filter);
                if (!location_data) {
                    // Send failure response if user not found
                    return res.status(400).json({ error: 'Location not found'});
                }
    
                const location_params: ILocation = {
                    address: req.body.address ? {
                        street: req.body.address.street || location_data.address?.street,
                        postalcode: req.body.address.postalcode || location_data.address?.postalcode,
                        city: req.body.address.city || location_data.address?.city
                    } : location_data.address || { street: '', postalcode: '', city: '' }, // Provide empty name object if not provided
                    activity: req.body.activity || location_data.activity
                };
                await this.location_service.updateLocation(location_params, location_filter);

                const new_location_data = await this.location_service.filterLocation(location_filter);
                // Send success response
                return res.status(200).json({ data: new_location_data, message: 'Successful update'});
            } else {
                // Send error response if ID parameter is missing
                return res.status(400).json({ error: 'Missing ID parameter' });
            }
        } catch (error) {
            // Catch and handle any errors
            console.error("Error updating:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    

    public async deleteLocation(req: Request, res: Response) {
        try {
            if (req.params.id) {

                const delete_details = await this.location_service.deleteLocation(req.params.id);
                if (delete_details.deletedCount !== 0) {
                    // Send success response if user deleted
                    return res.status(200).json({ message: 'Successful'});
                } else {
                    // Send failure response if user not found
                    return res.status(400).json({ error: 'Location not found' });
                }
            } else {
                // Send error response if ID parameter is missing
                return res.status(400).json({ error: 'Missing Id' });
            }
        } catch (error) {
            // Catch and handle any errors
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}