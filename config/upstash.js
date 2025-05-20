/**
 * Upstash Workflow Configuration
 * Sets up and exports a configured Upstash workflow client
 * Used for managing background jobs and scheduled tasks
 */

import { Client as WorkflowClient} from '@upstash/workflow' 
import { QSTASH_TOKEN, QSTASH_URL } from './env.js'

/**
 * Configured Upstash workflow client
 * Uses QStash service for managing background jobs
 */
export const workflowClient = new WorkflowClient({
    baseUrl: QSTASH_URL,
    token: QSTASH_TOKEN,
});