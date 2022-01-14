import mongoose from 'mongoose';

const basketSchema = new mongoose.Schema({
  basket: {},
});

export default mongoose.model('basket', basketSchema);
