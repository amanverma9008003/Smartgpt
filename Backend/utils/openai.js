import 'dotenv/config';
import {GoogleGenerativeAI} from '@google/generative-ai';

const genAi=new GoogleGenerativeAI(process.env.key);

async function runchat(message){
    const model = genAi.getGenerativeModel({model:"gemini-2.5-flash"})
    const chatSession = model.startChat();
    
    const send=await chatSession.sendMessage(message);
    const res=await send.response.text();
    return res;
    //await chatSession.sendMessage('How are you?');
    //await chatSession.sendMessage('I am fine, thank you.');
    //await chatSession.sendMessage('Bye');
}

export default runchat;