import { Schema, model } from 'mongoose';
// https://mongoosejs.com/docs/typescript.html#inferschematype

interface IUser {
    username: string;
    email: string;
    passwordHash: string; 
}

const userSchema = new Schema<IUser>(
    {
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true}
    },
    {
        collection: 'users'
    }
)

export const User = model<IUser>('User', userSchema);