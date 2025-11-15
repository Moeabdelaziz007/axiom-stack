// index.js - HoloCoreAgent
import { AxiomAgent } from '@axiom-id/sdk';

class Holocoreagent extends AxiomAgent {
  constructor(config) {
    super(config);
  }

  async initialize() {
    await super.initialize();
    console.log('HoloCoreAgent initialized');
  }
}

export default Holocoreagent;
