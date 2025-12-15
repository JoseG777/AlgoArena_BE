import mongoose from "mongoose";
import { connectDb } from "../lib/db_connect";
import { User } from "../model/User";
import { Friends } from "../model/Friends";

const USERNAMES: string[] = [
];

async function waitForMongo() {
  if (mongoose.connection.readyState === 1) return;
  await new Promise<void>((resolve, reject) => {
    mongoose.connection.once("open", () => resolve());
    mongoose.connection.once("error", (e) => reject(e));
  });
}

async function run() {
  connectDb();
  await waitForMongo();

  for (const username of USERNAMES) {
    const u = await User.findOne({ username }, { _id: 1, username: 1 }).lean();
    if (!u) {
      console.log(`Skip: user not found "${username}"`);
      continue;
    }

    const userId = String((u as any)._id);

    const userDel = await User.deleteOne({ _id: userId });
    const friendsDel = await Friends.deleteMany({
      $or: [{ userA: userId }, { userB: userId }],
    });

    console.log(
      `Deleted "${username}" (_id=${userId}) | userDeleted=${userDel.deletedCount ?? 0} | friendsDeleted=${friendsDel.deletedCount ?? 0}`,
    );
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
