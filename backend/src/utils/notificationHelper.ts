import Notification from '../models/Notification';

export const createNotification = async (
  userId: string,
  type: 'order' | 'product' | 'reward' | 'favorite' | 'badge' | 'mission' | 'points' | 'chat',
  title: string,
  message: string,
  imageUrl?: string,
  link?: string
) => {
  try {
    const notification = new Notification({
      user: userId,
      type,
      title,
      message,
      imageUrl,
      link,
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

