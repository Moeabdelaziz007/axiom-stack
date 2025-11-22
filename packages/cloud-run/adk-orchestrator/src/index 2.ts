import express from 'express';
import { json } from 'body-parser';

const app = express();
app.use(json());

// Placeholder ADK orchestrator endpoint
app.post('/run', (req, res) => {
    // TODO: integrate Google ADK session handling
    res.json({ message: 'ADK orchestrator placeholder', payload: req.body });
});

app.listen(8080, () => {
    console.log('ADK orchestrator running on port 8080');
});
