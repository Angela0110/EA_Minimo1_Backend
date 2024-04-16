
import { Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { ILocation } from './model';
import locations from './schema';

export default class LocationService {

    
    public async createLocation(location_params: ILocation): Promise<ILocation> {
        try {
            const session = new locations(location_params);
            const result = await session.save();
            // Convert _id to string
            const newUser: ILocation = { ...result.toObject(), _id: result._id };
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    
    public async filterLocation(query: any): Promise<ILocation | null> {
        try {
            return await locations.findOne(query);
        } catch (error) {
            throw error;
        }
    }

    public async updateLocation(location_params: ILocation, location_filter: any): Promise<void> {
        try {
            await locations.findOneAndUpdate(location_filter, location_params);
        } catch (error) {
            throw error;
        }
    }

    public async deleteLocation(_id: string): Promise<{ deletedCount: number }> {
        try {
            const query = { _id: _id };
            const result = await locations.deleteOne(query);

      return { deletedCount: result.deletedCount };
        } catch (error) {
            throw error;
        }
    }

    public async addActivityToLocation(locationId: Types.ObjectId, activityId: Types.ObjectId): Promise<void> {
        try {
            const location = await locations.findById(locationId);
            if (!location) {
                throw new Error('Location not found');
            }

            location.activity = activityId;
            // Save the updated document
            await location.save();
        } catch (error) {
            throw error;
        }
    }

    public async getAll(query: any): Promise<ILocation[] | null> {
        try {
            const locationWithPopulatedFields = await locations.find(query)
                .populate('activity')
                .exec();

            const populatedLocation: ILocation[] = locationWithPopulatedFields.map(location => ({
                ...location.toObject(),
                _id: location._id
            }));
    
            return populatedLocation;
        } catch (error) {
            console.error("Error fetching and populating locations:", error);
            return null;
        }
    }
    
    public async populateLocationActivity(query: any): Promise<ILocation | null> {
        try {
            const location = await locations.findOne(query)
                .populate('activity')
                .exec();
    
            if (!location) {
                return null;
            }
    
            const populatedLocation: ILocation = {
                ...location.toObject(),
                _id: location._id
            };
    
            return populatedLocation;
        } catch (error) {
            console.error("Error fetching and populating location activity:", error);
            return null;
        }
    }

}