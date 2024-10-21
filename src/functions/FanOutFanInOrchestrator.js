const { app } = require("@azure/functions");
const df = require("durable-functions");

const activityName = "FanOutFanInProcess";

// Define the fan-out/fan-in orchestrator function
df.app.orchestration("FanOutFanInOrchestrator", function* (context) {
  const dataList = ["Data1", "Data2", "Data3", "Data4"]; // Sample data inputs for activities
  context.log(
    `Starting fan-out orchestration with data: ${JSON.stringify(dataList)}`
  );

  try {
    // Fan-out: call multiple activities in parallel
    const tasks = dataList.map((data) =>
      context.df.callActivity(activityName, data)
    );
    const results = yield context.df.Task.all(tasks); // Wait for all tasks to complete

    context.log(`Aggregated results: ${JSON.stringify(results)}`);
    return results; // Return aggregated results
  } catch (error) {
    context.log.error(`Error in fan-out/fan-in orchestrator: ${error}`);
    throw error; // Rethrow error for monitoring
  }
});

// Define the ProcessData activity function
df.app.activity(activityName, {
  handler: async (input, context) => {
    context.log(`Input to ProcessData: '${JSON.stringify(input)}'`);

    try {
      // Simulate processing data (e.g., transform or perform calculations)
      const processedData = `Processed: ${input}`;
      context.log(`Processed data: ${processedData}`);
      return processedData; // Return the processed data
    } catch (error) {
      context.log.error(`Error processing data: ${error}`);
      throw error; // Rethrow error for monitoring
    }
  },
});

// Define the HTTP starter function for the fan-out/fan-in orchestrator
app.http("FanOutFanInHttpStart", {
  route: "start-fanout-fanin",
  extraInputs: [df.input.durableClient()],
  handler: async (request, context) => {
    const client = df.getClient(context);
    const instanceId = await client.startNew('FanOutFanInOrchestrator', {}); // The orchestrator name must be a string
    context.log(
      `Started fan-out/fan-in orchestration with ID = '${instanceId}'.`
    );
    return client.createCheckStatusResponse(request, instanceId);
  },
});
