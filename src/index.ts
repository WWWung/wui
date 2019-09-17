import { Select } from './ui/select/Select'

export function select(option: {
    //  选择器
    elem: string,
    //  占位符
    placeholder?: string
}): Select {
    return new Select(option)
}

export default {
    select
}


