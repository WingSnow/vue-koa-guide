import {Sequelize} from 'sequelize-typescript'
import path from 'path'
import User from "./User";
import Role from "./Role";
import UserRole from "./UserRole";

const sequelize = new Sequelize(
    {
		dialect: 'sqlite',
		storage: path.join(__dirname,'../secrets/vue-koa-database.db'),
        logging:false // sequelize默认会打印执行过程的SQL以便调试，可以通过设置options.logging来自定义
    })
sequelize.addModels([User, Role, UserRole])

export {sequelize, User, Role, UserRole}