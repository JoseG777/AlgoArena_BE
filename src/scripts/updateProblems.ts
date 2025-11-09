import { connectDb } from '../lib/db_connect';
import { Problem } from '../model/Problem';

async function run() {
  connectDb();

  const result = await Problem.updateMany(
    {
      $or: [{ problemDescription: { $exists: false } }],
    },
    {
      $set: {
        problemDescription: '',
      },
    },
  );

  console.log(`Updated ${result.modifiedCount} problems.`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
