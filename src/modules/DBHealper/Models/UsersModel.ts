import mongoose from 'mongoose';

interface IUser {
  email: string,
  password: string,
  role: string,
  orders?: mongoose.Types.ObjectId[]
}

const usersSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
    default: 'client',
  },

  orders: [{
    type: mongoose.Types.ObjectId,
    ref: 'orders',
  }],

});

export type UserModelType = (mongoose.Document<any, any, IUser> & IUser & { _id: mongoose.Types.ObjectId });

export default mongoose.model<IUser>('users', usersSchema);
