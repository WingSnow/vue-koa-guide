export default interface IMenuItem {
    label: string
    path: string
    name: string
    component?: string
    isMenu?: boolean
    isRoute?: boolean
    children?: IMenuItem[]
}