import { Sequelize } from 'sequelize';
import { databaseName } from '../../databasename';

class MySQL {
    private sequelize: Sequelize;

    constructor() {
        this.sequelize = new Sequelize(databaseName, 'root', '', {
            host: 'localhost',
            dialect: 'mysql',
        });

        this.testConnection();
    }

    private async testConnection() {
        try {
            await this.sequelize.authenticate();
            console.log('Conexión a la base de datos establecida correctamente.');
        } catch (error) {
            console.error('No se pudo conectar a la base de datos:', error);
        }
    }

    public getSequelizeInstance() {
        return this.sequelize;
    }
}

export default MySQL;
