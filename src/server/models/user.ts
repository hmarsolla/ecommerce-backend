import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    username: string,
    password: string,
    roles: [string],
    project: () => Partial<IUser>
}


export const UserSchema = new mongoose.Schema<IUser>({
    username: String,
    password: String,
    roles: [String]
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

export const UserModel = mongoose.model<IUser>('User', UserSchema);