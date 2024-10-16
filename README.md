
# Migration Tool with Azure Functions and Azurite

This project demonstrates how to fetch public data, transform it, and manage the process using Azure Functions with Durable Orchestrations. It also shows how to set up and use Azurite to emulate Azure Storage services for local development.

## Prerequisites

Before running this project, ensure you have the following installed:

- **[Node.js](https://nodejs.org/en/download/)** (v16 or higher)
- **[Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local#install-the-azure-functions-core-tools)**
- **[Visual Studio Code](https://code.visualstudio.com/)** 
- **[Azurite Extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=Azurite.azurite)**

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/rasika1995/migration-tool.git
cd migration-tool
```

### 2. Install Dependencies

Run the following command to install the required Node.js dependencies:

```bash
npm install
```

### 3. Start Azurite (Local Azure Storage Emulator)

Azurite is used to emulate Azure Blob, Queue, and Table services on your local machine.

#### Steps to Start Azurite via Visual Studio Code:

1. **Open Visual Studio Code**:
   - Launch Visual Studio Code.

2. **Open the Command Palette**:
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to open the **Command Palette**.

3. **Search for Azurite**:
   - Type "Azurite" in the Command Palette.
   - Select `Azurite: Start` and press **Enter**.

4. **Verify Azurite**:
   - The **Output** panel at the bottom of Visual Studio Code will show the logs confirming that Azurite is running.

This allows you to use Azurite as a local storage emulator for Blob, Queue, and Table storage.

### 4. Start the Azure Functions Project Locally

You can now run the Azure Functions locally. To start the project, run:

```bash
func host start
```

This will start the function app and expose the following endpoints:

- **Orchestrator Trigger** (HTTP): `http://localhost:7071/api/start-fetch-data`

### 5. Test the Orchestrator

You can start the orchestration process by sending a POST request to the function HTTP trigger.

Example:

```bash
curl -X POST "http://localhost:7071/api/start-fetch-data"
```

The orchestrator will fetch public data from a placeholder API, transform it, and return the processed result.

