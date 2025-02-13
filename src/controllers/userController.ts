import { Request, Response } from 'express';
import { User, Thought } from '../models';

  export const getUsers = async(_req: Request, res: Response) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  };

  export const getSingleUser = async(req: Request, res: Response) => {
    try {
        const user = await User.findOne({ _id: req.params.userId });
        if (!user) {
            res.status(404).json({ message: 'No user with that ID' });
            return;
        }
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};

  export const createUser = async(req: Request, res: Response) => {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
};

export const updateUser = async(req: Request, res: Response) => {
  try {
      const user = await User.findByIdAndUpdate(
          req.params.userId,
          req.body,
          { new: true }
      );
      if (!user) {
          res.status(404).json({ message: 'No user with this id!' });
          return;
      }
      res.json(user);
  } catch (err) {
      res.status(500).json(err);
  }
};

export const deleteUser = async(req: Request, res: Response) => {
  try {
      const user = await User.findByIdAndDelete(req.params.userId);
      if (!user) {
          res.status(404).json({ message: 'No user with this id!' });
          return;
      }
      // BONUS: Remove user's thoughts when deleted
      await Thought.deleteMany({ username: user.username });
      res.json({ message: 'User and associated thoughts deleted!' });
  } catch (err) {
      res.status(500).json(err);
  }
};

export const addFriend = async(req: Request, res: Response) => {
  try {
      const user = await User.findByIdAndUpdate(
          req.params.userId,
          { $addToSet: { friends: req.params.friendId } },
          { new: true }
      );
      if (!user) {
          res.status(404).json({ message: 'No user with this id!' });
          return;
      }
      res.json(user);
  } catch (err) {
      res.status(500).json(err);
  }
};

export const removeFriend = async(req: Request, res: Response) => {
  try {
      const user = await User.findByIdAndUpdate(
          req.params.userId,
          { $pull: { friends: req.params.friendId } },
          { new: true }
      );
      if (!user) {
          res.status(404).json({ message: 'No user with this id!' });
          return;
      }
      res.json(user);
  } catch (err) {
      res.status(500).json(err);
  }
};

