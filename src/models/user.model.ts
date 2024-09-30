import { DataTypes, Model } from 'sequelize';
import { IUser } from '../interfaces/IUser.interface';
import sequelize from './../config/Sequelize.config';

class Users extends Model<IUser> {
    public id!: string;
    public username!: string;
    public email!: string;
    public password!: string;
    public status!: boolean;
    public confirmPassword!: boolean;
    public token?: string;
}

Users.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        confirmPassword: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true, // `token` es opcional
        },
    },
    {
        sequelize,
        tableName: 'users',
    }
);

export default Users;

