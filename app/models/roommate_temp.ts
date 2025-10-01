import { Schema, model, models } from 'mongoose';

const amenitiesSchema = new Schema({
  wifi: { type: Boolean, default: false },
  ac: { type: Boolean, default: false },
  food: { type: Boolean, default: false },
  parking: { type: Boolean, default: false },
  bed: { type: Boolean, default: false },
  table: { type: Boolean, default: false },
  washingMachine: { type: Boolean, default: false },
}, { _id: false });

const contactSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
}, { _id: false });

const roommateSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required.'],
  },
  listingType: {
    type: String,
    enum: ['Flat', 'PG'],
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Any'],
  },
  address: {
    type: String,
    required: [true, 'Address is required.'],
  },
  latitude: Number,
  longitude: Number,
  deposit: {
    type: Number,
    required: true,
  },
  rent: {
    type: Number,
    required: true,
  },
  maintenance: {
    type: Number,
  },
  furnishing: {
    type: String,
    enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amenities: amenitiesSchema,
  imageUrls: {
    type: [String],
    required: true,
  },
  contact: contactSchema,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This should match the name of your User model
    required: true,
  }
 
});

// Using the name 'Roommate' will create a 'roommates' collection in MongoDB
const Roommate = models.Roommate || model('Roommate', roommateSchema);

export default Roommate;