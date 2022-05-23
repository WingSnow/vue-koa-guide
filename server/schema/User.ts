import {Table, PrimaryKey, Column, Model, BelongsToMany, AllowNull} from "sequelize-typescript"
import Role from "./Role";
import UserRole from "./UserRole";

@Table
class User extends Model {
    @PrimaryKey
    @Column
    id!: string

    @AllowNull(false)
    @Column
    username!: string

    @AllowNull(false)
    @Column
    password!: string

    @Column
    name!: string

    @BelongsToMany(() => Role, () => UserRole)
    roles!: Role[];
}

export default User