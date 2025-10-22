import { Schema, model } from 'mongoose';

interface IRequest {
   requester: string;
   recipient: string;
   status: 'pending' | 'rejected' | 'accepted';
}

const FriendRequestSchema = new Schema<IRequest>(
   {
      requester: {type: String, required: true},
      recipient: {type: String, required: true,
         validate: {
            validator: function (value: string) {
               return value !== this.requester;
            },
            message: 'Cannot send friend request to themself.',
         },
      },
      status: {type: String, enum: ['pending', 'rejected', 'accepted'], default: 'pending', required: true},
   },
   {
      collection: "friendrequests",
   }
);

export const FriendRequest = model<IRequest>('FriendRequest', FriendRequestSchema);