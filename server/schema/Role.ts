import {Table, PrimaryKey, Column, Model, BelongsToMany, AllowNull, Default} from "sequelize-typescript"
import UserRole from "./UserRole";
import User from "./User";

@Table
class Role extends Model {
    @PrimaryKey
    @Column
    id!: string

    @AllowNull(false)
    @Column
    name!: string

    @Default(false)
    @Column
    isAdmin!: boolean

    @BelongsToMany(() => User, () => UserRole)
    user!: Role[];
}

export default Role