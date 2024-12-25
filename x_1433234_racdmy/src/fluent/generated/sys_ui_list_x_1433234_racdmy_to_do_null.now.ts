import { default_view, List } from '@servicenow/sdk/core'

export default List({
    $id: '1c0c332683aa12103e34c7e0deaad36e',
    view: default_view,
    table: 'x_1433234_racdmy_to_do',
    columns: ['deadline', 'state', 'task'],
})
