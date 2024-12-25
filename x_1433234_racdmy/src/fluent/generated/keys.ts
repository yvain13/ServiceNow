import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    '10': {
                        table: 'x_1433234_racdmy_to_do'
                        id: '89d8101e4fa044b092b1fecec225474d'
                    }
                    cs0: {
                        table: 'sys_script_client'
                        id: 'b8f2d3a10c4a477c8b8be5d091e1a637'
                    }
                    dist_server_script_js: {
                        table: 'sys_module'
                        id: 'dbe2b23ea23142d0a469a28f6637aa96'
                    }
                    br0: {
                        table: 'sys_script'
                        id: '1174dc0c57c24ff8994f78c8acedc75a'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '077f1774f47746dba1b2f83f409fc578'
                    }
                    'src_server_rest-api-handler_js': {
                        table: 'sys_module'
                        id: '45558e1d0b534eb786a1f72fe862e4c0'
                    }
                    'Default view': {
                        table: 'sys_ui_view'
                        id: 'efeee3e30a41469993c3c4be7bfe549c'
                    }
                }
                composite: [
                    {
                        table: 'sys_ui_list_element'
                        id: 'd5cefb7d6a484789a2ee3221ae624e41'
                        key: {
                            list: '1c0c332683aa12103e34c7e0deaad36e'
                            element: 'deadline'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '0409522fddaa457eb43b93de9e63f31d'
                        key: {
                            list: '1c0c332683aa12103e34c7e0deaad36e'
                            element: 'state'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '87d4b05aa3de4c4b99b20aaeee4926d2'
                        key: {
                            list: '1c0c332683aa12103e34c7e0deaad36e'
                            element: 'task'
                        }
                    },
                ]
                deleted: {
                    x_1433234_racdmy_to_do: [
                        '427924b3d0924926a19091fe2d678984',
                        '00bea4d4813b4346966a3063cf86d5a9',
                        '4a62193fd9cd4e26a24011f9d5f4a2fc',
                        '4e2f1c9d61054f49800ac0760311c623',
                        '5e17bb8df9624d3c87188d2ef7edac4b',
                        '0245dd03338043d0802aea3af2823d0e',
                        'fafb4cce59d1467388fa7eebb654c877',
                        '3771e5a5e90445009ceef6e4a7df7a5b',
                        '0cce0e6c92ed42e7a7079b9b64fbe9f3',
                        '1fc37ae373aa4c6db618b1a3c8b77c6b',
                        'e47e49fa2ddf43b1b1bca9b78ad587fa',
                        '6233e9be5fcd4fd5874f9f9d7128d49f',
                        'a88f36154098420abbc4daef9bb8fe66',
                        '6130d857850745bba789b3b6ff7767a0',
                        '40a595251f4f432f9ce3c74939a0d1b4',
                        '12c1ef8757a34c5db54254cf608123f0',
                    ]
                    sys_ws_definition: ['7089749324264900852958ac4554bc25', 'c84983119d3f4ac9b7d069d9eca7b944']
                    sys_ws_operation: [
                        'adab6de9b5584940a46d95e47c8d2f36',
                        '8372e83ee1f24db3a982474508e556dd',
                        '113ee8a721894e91a2e3cd24c0b7249e',
                        '50ee16d565a94946a55677819cf6aebf',
                        '8383be4aa40c48ef80a7da377a7902a8',
                    ]
                    sys_ui_list_element: [
                        '308d82234807493689379bbdef19e303',
                        '832447a965c34bf5818963c6b11a9a00',
                        'c0d8c16b6ff9486980cfd14deee9ed5d',
                        '4251f2c0e2bc4abfaee78c0a32530c7e',
                        '71d7e595007c496bbcb81004cbda9121',
                        'a2b761f7752a4c88b3a4f98730c6e636',
                    ]
                }
            }
        }
    }
}
