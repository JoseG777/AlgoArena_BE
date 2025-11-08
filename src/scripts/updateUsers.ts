import { connectDb } from '../lib/db_connect';
import { User } from '../model/User';

async function run() {
  connectDb();

  const result = await User.updateMany(
    {
      $or: [{ stats: { $exists: false } }, { 'stats.totalPoints': { $exists: false } }],
    },
    {
      $set: {
        'stats.totalPoints': 0,
        'stats.matches': 0,
        'stats.wins': 0,
        'stats.losses': 0,
        'stats.ties': 0,
      },
    },
  );

  console.log(`Updated ${result.modifiedCount} users.`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
