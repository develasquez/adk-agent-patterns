import { LlmAgent } from '@google/adk';

// --- Constants ---
const GEMINI_MODEL = "gemini-2.5-flash";

// --- 1. Define Specialized Sub-Agents ---

const carInsuranceAgent = new LlmAgent({
    name: "CarInsuranceAgent",
    model: GEMINI_MODEL,
    // The 'description' is CRITICAL. The Router reads this to make decisions.
    description: "Expert exclusively in Car insurance, buying new or used cars, car accidents, roadside assistance, and deductibles.",
    instruction: `You are an Car Insurance Specialist. 
    Respond to the user's query about their vehicle concisely. Ask for car details (make, model, year) if necessary to provide a quote.
    Output *only* your response as an expert agent.`
});

const lifeInsuranceAgent = new LlmAgent({
    name: "LifeInsuranceAgent",
    model: GEMINI_MODEL,
    description: "Expert in life insurance, death policies, savings for the future, and family protection.",
    instruction: `You are a Life Insurance Specialist. 
    Respond to the user's query with empathy and professionalism, focusing on long-term family protection.
    Output *only* your response as an expert agent.`
});

const healthInsuranceAgent = new LlmAgent({
    name: "HealthInsuranceAgent",
    model: GEMINI_MODEL,
    description: "Expert in supplementary health insurance, medical expense reimbursements, clinics, and pharmacies.",
    instruction: `You are a Supplementary Health Insurance Specialist. 
    Explain how medical reimbursements and health coverages work in simple terms.
    Output *only* your response as an expert agent.`
});

// --- 2. Define the Router Agent (Root) ---

export const routerAgent = new LlmAgent({
    name: "InsuranceRouterAgent",
    model: GEMINI_MODEL,
    description: "The main orchestrator that greets the user and routes the task.",
    // Sub-agents are injected directly into the main Router
    subAgents: [carInsuranceAgent, lifeInsuranceAgent, healthInsuranceAgent],
    instruction: `You are the Main Coordinator (Router) of an insurance agency.
    Your *only* job is to analyze the client's initial request and route it to the correct specialized sub-agent.
    
    Routing Rules:
    1. Analyze the user's intent.
    2. Review the 'descriptions' of your available sub-agents.
    3. Silently delegate the task to the best matching agent. DO NOT attempt to answer the insurance question yourself.
    4. If the user's query is too ambiguous (e.g., "I need insurance" but doesn't specify which type), reply directly asking them to clarify if they are looking for auto, life, or health insurance.
    `
});