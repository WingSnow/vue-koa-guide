import {User, Role} from "../schema/db";
import config from "../config";

// 返回id对应的User对象，如果不存在返回null；includeRoles参数决定是否关联查询出user拥有的roles
async function getUserById(id: string, includeRoles = false): Promise<User | null> {
    return User.findOne({
        include: includeRoles ? [Role] : [],
        where: {id: id}
    })
}

async function getUserByUsername(username: string, includeRoles = false): Promise<User | null> {
    return User.findOne({
        include: includeRoles? [Role]: [],
        where: {username: username}
    })
}

// 返回username和password对应的User对象，如果不存在返回null
async function checkUser(username: string, password: string): Promise<User | null> {
    return User.findOne({where: {username: username, password: password}
    })
}

//  返回id对应的User具有的Roles（字符串数组），如果不存在则更新数据库，增加普通用户权限并返回
async function getRoles(id: string): Promise<string[]> {
    // 检查是否存在该id对应的用户，如果不存在则返回空数组
    const user = await User.findOne({where: {id: id}})
    if (!user) return []

    const roles = await user.$get('roles')
    if (roles.length <= 0) {
        const normalRole = await getNormalUser()
        await user.$add('Role', normalRole)
        roles.push(normalRole)
    }
    return roles.map(role => role.name)
}

async function getNormalUser(): Promise<Role> {
    const normalRole = await Role.findOne({where: {name: config.ROLE_USER}})
    if(normalRole) return normalRole
    else throw Error('Role NormalUser is not initial.')
}

export {getUserById, getUserByUsername, checkUser, getRoles}