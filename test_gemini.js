const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyDhCguR0lIAoThY296LqCr16-RbJU5-QIY");

async function testModels() {
  try {
    console.log("Intentando con gemini-2.0-flash...");
    let model = genAI.getGenerativeModel({model: 'gemini-2.0-flash'});
    let result = await model.generateContent("test");
    console.log("✓ gemini-2.0-flash funciona");
  } catch (e) {
    console.log("✗ gemini-2.0-flash error:", e.message);
  }
  
  try {
    console.log("\nIntentando con gemini-1.5-flash...");
    let model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'});
    let result = await model.generateContent("test");
    console.log("✓ gemini-1.5-flash funciona");
  } catch (e) {
    console.log("✗ gemini-1.5-flash error:", e.message);
  }
}

testModels();
