import mongoose from 'mongoose';

const calculationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  solution: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  modelName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Calculation = mongoose.model('Calculation', calculationSchema);

export default Calculation;