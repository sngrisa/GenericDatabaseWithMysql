import { Sequelize } from 'sequelize';
import { databaseName } from '../../databasename';

const sequelize = new Sequelize(databaseName, 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

export default sequelize;