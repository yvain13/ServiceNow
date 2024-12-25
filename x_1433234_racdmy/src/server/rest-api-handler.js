import { Record } from "@servicenow/sdk/core";

export function process(request, response) {
    try {
        if (request.method === 'POST') {
            const { task, state, deadline } = request.body;
            
            // Create a new todo record
            const todoRecord = Record({
                table: 'x_1433234_racdmy_to_do',
                data: {
                    task,
                    state,
                    deadline
                }
            });

            response.setStatus(201);
            response.setBody({
                success: true,
                message: 'Todo created successfully'
            });
        } else {
            response.setStatus(405);
            response.setBody({
                success: false,
                message: 'Method not allowed'
            });
        }
    } catch (error) {
        response.setStatus(500);
        response.setBody({
            success: false,
            message: error.message
        });
    }
}