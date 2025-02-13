import { Request, Response } from 'express';
import { Thought, User } from '../models';

export const getThoughts = async (_req: Request, res: Response) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getSingleThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId });
        if (!thought) {
            res.status(404).json({ message: 'No thought with that ID' });
            return;
        }
        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const createThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.create(req.body);
        // Update user's thoughts array
        await User.findByIdAndUpdate(
            req.body.userId,
            { $push: { thoughts: thought._id } },
            { new: true }
        );
        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const updateThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            req.body,
            { new: true }
        );
        if (!thought) {
            res.status(404).json({ message: 'No thought with this id!' });
            return;
        }
        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
};
// Delete a thought
export const deleteThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
        if (!thought) {
            res.status(404).json({ message: 'No thought with this id!' });
            return;
        }

        // Remove thought from user's thoughts array using username
        await User.findOneAndUpdate(
            { username: thought.username },
            { $pull: { thoughts: req.params.thoughtId } }
        );

        res.json({ message: 'Thought deleted!' });
    } catch (err) {
        res.status(500).json(err);
    }
};

// Add a reaction
export const createReaction = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $push: { reactions: req.body } },
            { new: true }
        );
        if (!thought) {
            res.status(404).json({ message: 'No thought with this id!' });
            return;
        }
        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Remove a reaction
export const deleteReaction = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        );
        if (!thought) {
            res.status(404).json({ message: 'No thought with this id!' });
            return;
        }
        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
};