import { Schema, model } from 'mongoose';

interface IFriends {
   userA: string;
   userB: string;
   date: Date;
}

const FriendshipSchema = new Schema<IFriends>(
   {
      userA: {type: String, required: true, index: true},
      userB: {type: String, required: true, index: true},
      date: {type: Date, default: Date.now, required: true},
   },
   {
      collection: 'friends',
   }
);

// FriendshipSchema.pre('save', function (next) {
//    if (this.userA > this.userB) {
//       const temp = this.userA;
//       this.userA = this.userB;
//       this.userB = temp;
//    }
//    next();
// });

FriendshipSchema.index({userA: 1, userB: 1}, {unique: true});

export const Friends = model<IFriends>('Friends', FriendshipSchema);