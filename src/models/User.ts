import { Schema, model, Document, ObjectId } from 'mongoose';

interface IUser extends Document { 
  username: string;
  email: string;
  thoughts: ObjectId[];
  friends: ObjectId[];
  friendCount?: number;   //virtual
}

// Schema to create User model
const userSchema = new Schema<IUser>({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Must match a valid email address']
    },
    thoughts: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Thought'
        }
    ],
    friends: [
        {
        type: Schema.Types.ObjectId,
        ref: 'User'
        }
    ]
  },
  {
    toJSON: {
       virtuals: true
    },
    id: false
});

// Create a virtual property `friendCount` that gets the amount of thoughts per post
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

// Initialize our User model
const User = model<IUser>('User', userSchema);

export default User;
