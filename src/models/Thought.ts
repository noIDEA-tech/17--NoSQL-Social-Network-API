import { Schema, model, Document, ObjectId, Types } from 'mongoose';

// interface for Reaction (subdocument)
interface IReaction {
    reactionId: ObjectId;
    reactionBody: string;
    username: string;
    createdAt: Date;
}

// interface for thougth doc
interface IThought extends Document {
    thoughtText: string;
    createdAt: Date;
    username: string;
    reactions: IReaction[];
    reactionCount?: number; //virtual
}

const reactionSchema = new Schema<IReaction>({
     reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
     reactionBody: {
      type: String,
      required: true,
      maxlength: 280
    },
     username: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp: Date) => new Date(timestamp)
    }
});

// Define the schema for thoughts
const thoughtSchema = new Schema<IThought>({
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp: Date) => new Date(timestamp)
    },
    username: {
      type: String,
      required: true
    },
    reactions: [reactionSchema]
  }, 
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false      
});

// Virtual to get the reaction count
thoughtSchema.virtual('reactionCount').get(function(this: IThought) {
    return this.reactions?.length || 0;
});

// Create the Thought model
const Thought = model<IThought>('Thought', thoughtSchema);

export default Thought;