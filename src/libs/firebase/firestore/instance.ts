import { getFirestore } from "firebase/firestore";
import { app } from "@/libs/firebase/app";

export const firestore = getFirestore(app);
