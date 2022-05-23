import {Table, Column, Model,  ForeignKey} from "sequelize-typescript"
import User from "./User";
import Role from "./Role"

@Table({
    tableName: 'UserRole'
})
export class UserRole extends Model {
    @ForeignKey(() => User)
    @Column
    userId!: string

    @ForeignKey(() => Role)
    @Column
    roleId!: number
}

export default UserRole