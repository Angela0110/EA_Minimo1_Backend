import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
    address: {
        street: { type: String, required: true },
        postalcode:   { type: Number, required: true },
        city:   { type: String, required: true }
    },
    activity: {type: Schema.Types.ObjectId, ref: 'activities', required: true}
});

export default mongoose.model('locations', schema);