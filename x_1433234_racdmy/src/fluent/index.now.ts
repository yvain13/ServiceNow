import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { ClientScript } from '@servicenow/sdk/core'
import { Table, DateColumn, StringColumn } from '@servicenow/sdk/core'
import { showStateUpdate } from '../server/script.js'

//creates todo table, with three columns (deadline, status and task)
export const x_1433234_racdmy_to_do = Table({
    name: 'x_1433234_racdmy_to_do',
    schema: {
        deadline: DateColumn({ label: 'deadline' }),
        state: StringColumn({
            label: 'State',
            choices: {
                ready: { label: 'Ready' },
                completed: { label: 'Completed' },
                in_progress: { label: 'In Progress' },
            },
        }),
        task: StringColumn({ label: 'Task', maxLength: 120 }),
    },
})

//creates a client script that pops up 'Table loaded successfully!!' message everytime todo record is loaded
ClientScript({
    $id: Now.ID['cs0'],
    name: 'my_client_script',
    table: 'x_1433234_racdmy_to_do',
    active: true,
    applies_extended: false,
    global: true,
    ui_type: 'all',
    description: 'Custom client script generated by Now SDK',
    messages: '',
    isolate_script: false,
    type: 'onLoad',
    script: script`function onLoad() {
        g_form.addInfoMessage("Table loaded successfully!!")
    }`,
})

//creates a business rule that pops up state change message whenever a todo record is updated
BusinessRule({
    $id: Now.ID['br0'],
    action: ['update'],
    table: 'x_1433234_racdmy_to_do',
    script: showStateUpdate,
    name: 'LogStateChange',
    order: 100,
    when: 'after',
    active: true,
})