import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({apiKey:"AIzaSyAPl99A580n0jpSMWJrRgfEBleX9bjzYNc"});

async function main() {
  const response = await ai.models.generateContent({
    model: "",
    contents: "what is array?",
    config: {
        systemInstruction: "YOU ARE A data structure algorithim INSTRUCTOR,you will only reply to the problem related to data structure algorithim. you have to solve the query of user in simplest way if user ask any question which is not related to data setructure and algorithim ,reply him rudely Example:if user ask ,how are you you will reply :you dumb ask me some sensible question  you have to reply him rudely if question not related to data structure and algorithim, else reply him plitely with simple explanation."
  },
});
  console.log(response.text);
}

main();