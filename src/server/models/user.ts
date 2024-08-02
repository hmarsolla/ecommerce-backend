import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    username: string,
    password: string,
    roles: [string],
    project: () => Partial<IUser>
}


export const UserSchema = new Schema<IUser>({
    username: { type: String, required: true },
    password: { type: String, required: true },
    roles: { type: [String], required: true }
},
{timestamps: true});

UserSchema.index({username: 1}, {unique: true});

UserSchema.methods.project = function () {
    return {
        id: this._id,
        username: this.username,
        roles: this.roles
    }
}

export const User = model<IUser>('User', UserSchema);