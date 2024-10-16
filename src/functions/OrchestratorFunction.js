const { app } = require('@azure/functions');
const df = require('durable-functions');

// Define the name of the activities
const activityFetchName = 'FetchPublicData';
const activityTransformName = 'TransformData';

// Define the orchestrator function
df.app.orchestration('OrchestratorFunctionOrchestrator', function* (context) {
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Public API URL
    context.log(`Starting orchestration with URL: ${apiUrl}`);
    
    try {
        // Call the FetchPublicData activity
        const fetchedData = yield context.df.callActivity(activityFetchName, { url: apiUrl });
        context.log(`Fetched data: ${JSON.stringify(fetchedData)}`);
        
        // Call the TransformData activity with fetched data
        const transformedData = yield context.df.callActivity(activityTransformName, fetchedData);
        context.log(`Transformed data: ${JSON.stringify(transformedData)}`);
        
        return transformedData; // Return the transformed data
    } catch (error) {
        context.log.error(`Error in orchestrator: ${error}`);
        throw error; // Rethrow error for monitoring
    }
});

// Define the FetchPublicData activity function
df.app.activity(activityFetchName, {
    handler: async (input, context) => { // Ensure context is included
        context.log(`Input to FetchPublicData: '${JSON.stringify(input)}'`);
        
        try {
            const response = await fetch(input.url);
            context.log(`Response status: ${response.status}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            context.log(`Fetched data: ${JSON.stringify(data)}`);
            return data; // Return the fetched data
        } catch (error) {
            context.log.error(`Error fetching data: ${error}`);
            throw error; // Rethrow error for monitoring
        }
    },
});

// Define the TransformData activity function
df.app.activity(activityTransformName, {
    handler: async (data, context) => {
        context.log(`Input to TransformData: '${JSON.stringify(data)}'`);
        
        try {
            // Example transformation: mapping posts to a simpler structure
            const transformed = data.map(post => ({
                id: post.id,
                title: post.title,
                body: post.body,
            }));
            context.log(`Transformed data: ${JSON.stringify(transformed)}`);
            return transformed; // Return the transformed data
        } catch (error) {
            context.log.error(`Error transforming data: ${error}`);
            throw error; // Rethrow error for monitoring
        }
    },
});

// Define the HTTP starter function for orchestrator
app.http('OrchestratorFunctionHttpStart', {
    route: 'start-fetch-data',
    extraInputs: [df.input.durableClient()],
    handler: async (request, context) => {
        const client = df.getClient(context);
        const instanceId = await client.startNew('OrchestratorFunctionOrchestrator', {}); // Use correct orchestrator name

        context.log(`Started orchestration with ID = '${instanceId}'.`);
        return client.createCheckStatusResponse(request, instanceId);
    },
});
