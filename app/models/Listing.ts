import { Schema, model, models } from 'mongoose';

const amenitiesSchema = new Schema({
  wifi: { type: Boolean, default: false },
  ac: { type: Boolean, default: false },
  food: { type: Boolean, default: false },
  parking: { type: Boolean, default: false },
  bed: { type: Boolean, default: false },
  table: { type: Boolean, default: false },
    washingMachine: { type: Boolean, default: false }, // Added missing field from your form

}, { _id: false });

const contactSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
}, { _id: false });

const listingSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This creates a reference to the User model
    required: true,
  },
  title: { type: String, required: [true, 'Title is required.'] },
  listingType: { type: String, enum: ['PG', 'Flat', 'Hostel'], required: true },
 bhkType: { type: String },      // For 'Flat' type
  bedsPerRoom: { type: Number }, // total beds in a room
  availableBeds: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Any'] },
  address: { type: String, required: [true, 'Address is required.'] },
  latitude: { type: Number },
  longitude: { type: Number },
  deposit: { type: Number, required: true },
  rentPerMonth: { type: Number, required: true },
  maintenance: { type: Number, default: 0 },
  electricityBillBy: { type: String, enum: ['Owner', 'Tenant', 'Shared'] },
  furnished: { type: String, enum: ['Furnished', 'Semi-furnished', 'Unfurnished'] },
  description: { type: String, required: true },
  amenities: amenitiesSchema,
  imageUrls: { type: [String], required: true },
  contact: contactSchema,
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
}, { timestamps: true });

const Listing = models.Listing || model('Listing', listingSchema);

export default Listing;