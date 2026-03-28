
import {  LlmAgent, SequentialAgent, ParallelAgent, GoogleSearchTool } from '@google/adk';
import { z } from 'zod';

const GEMINI_MODEL = "gemini-2.5-flash";

 const researchTools = [new GoogleSearchTool()];

 
 const researcherAgent1 = new LlmAgent({
     name: "RenewableEnergyResearcher",
     model: GEMINI_MODEL,
     instruction: `You are an AI Research Assistant specializing in energy.
 Research the latest advancements in 'renewable energy sources'.
 Use the Google Search tool provided.
 Summarize your key findings concisely (1-2 sentences).
 Output *only* the summary.
 `,
     description: "Researches renewable energy sources.",
     tools: researchTools,
     outputKey: "renewable_energy_result"
 });

 
 const researcherAgent2 = new LlmAgent({
     name: "EVResearcher",
     model: GEMINI_MODEL,
     instruction: `You are an AI Research Assistant specializing in transportation.
 Research the latest developments in 'electric vehicle technology'.
 Use the Google Search tool provided.
 Summarize your key findings concisely (1-2 sentences).
 Output *only* the summary.
 `,
     description: "Researches electric vehicle technology.",
     tools: researchTools,
     outputKey: "ev_technology_result"
 });

 // Researcher 3: Carbon Capture
 const researcherAgent3 = new LlmAgent({
     name: "CarbonCaptureResearcher",
     model: GEMINI_MODEL,
     instruction: `You are an AI Research Assistant specializing in climate solutions.
 Research the current state of 'carbon capture methods'.
 Use the Google Search tool provided.
 Summarize your key findings concisely (1-2 sentences).
 Output *only* the summary.
 `,
     description: "Researches carbon capture methods.",
     tools: researchTools,
     outputKey: "carbon_capture_result"
 });


 const parallelResearchAgent = new ParallelAgent({
     name: "ParallelWebResearchAgent",
     subAgents: [researcherAgent1, researcherAgent2, researcherAgent3],
     description: "Runs multiple research agents in parallel to gather information."
 });

 const mergerAgent = new LlmAgent({
     name: "SynthesisAgent",
     model: GEMINI_MODEL,  
     instruction: `You are an AI Assistant responsible for combining research findings into a structured report.

 Your primary task is to synthesize the following research summaries, clearly attributing findings to their source areas. Structure your response using headings for each topic. Ensure the report is coherent and integrates the key points smoothly.

 **Crucially: Your entire response MUST be grounded *exclusively* on the information provided in the 'Input Summaries' below. Do NOT add any external knowledge, facts, or details not present in these specific summaries.**

 **Input Summaries:**

 *   **Renewable Energy:**
     {renewable_energy_result}

 *   **Electric Vehicles:**
     {ev_technology_result}

 *   **Carbon Capture:**
     {carbon_capture_result}

 **Output Format:**

 ## Summary of Recent Sustainable Technology Advancements

 ### Renewable Energy Findings
 (Based on RenewableEnergyResearcher's findings)
 [Synthesize and elaborate *only* on the renewable energy input summary provided above.]

 ### Electric Vehicle Findings
 (Based on EVResearcher's findings)
 [Synthesize and elaborate *only* on the EV input summary provided above.]

 ### Carbon Capture Findings
 (Based on CarbonCaptureResearcher's findings)
 [Synthesize and elaborate *only* on the carbon capture input summary provided above.]

 ### Overall Conclusion
 [Provide a brief (1-2 sentence) concluding statement that connects *only* the findings presented above.]

 Output *only* the structured report following this format. Do not include introductory or concluding phrases outside this structure, and strictly adhere to using only the provided input summary content.
 `,
     description: "Combines research findings from parallel agents into a structured, cited report, strictly grounded on provided inputs.",
 });


 export const rootAgent = new SequentialAgent({
     name: "ResearchAndSynthesisPipeline",
     subAgents: [parallelResearchAgent, mergerAgent],
     description: "Coordinates parallel research and synthesizes the results."
 });