import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../Firebase/firebase';

export const notify = async (targetUid, currentUid, message) => {
  try {
    const notificationRef = doc(db, "notifications", targetUid);

    const docSnapshot = await getDoc(notificationRef);

    const notification = {
      from: currentUid,
      message: message,
      to:targetUid
    };

    if (docSnapshot.exists()) {
      await updateDoc(notificationRef, {
        notifications: arrayUnion(notification),
      });
    } else {
      await setDoc(notificationRef, {
        notifications: [notification], 
      });
    }

    console.log("Notification sent successfully.");
  } catch (error) {
    console.error("Error sending notification:", error.message);
  }
};
