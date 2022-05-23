import fs from 'fs'
import path from 'path'

export default {
    SECRET: fs.readFileSync(path.resolve(__dirname, 'secrets', 'jwt-key.txt')),
    EXP_TIME: '1h',
    ROLE_USER: 'NormalUser' // 角色NormalUser的ID
}