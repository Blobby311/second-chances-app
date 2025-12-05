import express, { Response } from 'express';
import { Mission, UserMission } from '../models/Mission';
import { authenticate, AuthRequest } from '../middleware/auth';
import PointsTransaction from '../models/Points';
import Notification from '../models/Notification';

const router = express.Router();

// Get daily missions
router.get('/daily', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const missions = await Mission.find({ type: 'daily', isActive: true });

    const userMissions = await Promise.all(
      missions.map(async (mission) => {
        let userMission = await UserMission.findOne({
          user: req.userId,
          mission: mission._id,
          resetAt: { $gte: new Date() }, // Not expired
        });

        if (!userMission) {
          // Create new user mission for today
          const resetAt = new Date();
          resetAt.setHours(24, 0, 0, 0); // End of today
          userMission = new UserMission({
            user: req.userId,
            mission: mission._id,
            resetAt,
          });
          await userMission.save();
        }

        return {
          ...mission.toObject(),
          progress: userMission.progress,
          isCompleted: userMission.isCompleted,
          isClaimed: userMission.isClaimed,
        };
      })
    );

    res.json(userMissions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get weekly missions
router.get('/weekly', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const missions = await Mission.find({ type: 'weekly', isActive: true });

    const userMissions = await Promise.all(
      missions.map(async (mission) => {
        let userMission = await UserMission.findOne({
          user: req.userId,
          mission: mission._id,
          resetAt: { $gte: new Date() }, // Not expired
        });

        if (!userMission) {
          // Create new user mission for this week
          const resetAt = new Date();
          resetAt.setDate(resetAt.getDate() + (7 - resetAt.getDay())); // End of week
          resetAt.setHours(23, 59, 59, 999);
          userMission = new UserMission({
            user: req.userId,
            mission: mission._id,
            resetAt,
          });
          await userMission.save();
        }

        return {
          ...mission.toObject(),
          progress: userMission.progress,
          isCompleted: userMission.isCompleted,
          isClaimed: userMission.isClaimed,
        };
      })
    );

    res.json(userMissions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Claim mission points
router.post('/:id/claim', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userMission = await UserMission.findOne({
      user: req.userId,
      mission: req.params.id,
    }).populate('mission');

    if (!userMission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    if (!userMission.isCompleted) {
      return res.status(400).json({ error: 'Mission not completed' });
    }

    if (userMission.isClaimed) {
      return res.status(400).json({ error: 'Mission already claimed' });
    }

    userMission.isClaimed = true;
    await userMission.save();

    // Award points
    const mission = userMission.mission as any;
    await PointsTransaction.create({
      user: req.userId,
      amount: mission.points,
      type: 'earn',
      source: 'mission',
      description: `Points earned for completing mission: ${mission.name}`,
    });

    // Create notification
    await Notification.create({
      user: req.userId,
      type: 'mission',
      title: 'Mission Completed',
      message: `You earned ${mission.points} points for completing ${mission.name}!`,
      link: '/rewards',
    });

    res.json({ message: 'Points claimed successfully', points: mission.points });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

