import * as mongoose from 'mongoose';

export interface ILocation {
    _id?: mongoose.Types.ObjectId; // Optional _id field
    address: {
        street: String;
        postalcode: Number;
        city: String;
    };
    activity: mongoose.Types.ObjectId; 
}