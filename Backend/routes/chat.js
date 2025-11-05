import express from "express";
import Thread from "../models/Thread.js";
import runchat from '../utils/openai.js';

const router = express.Router();

/*router.post("/test",async(req,res)=>{
    try{
        const thread=new Thread({
            threadId:"xyz",
            title:"Testing new thread"
        });

        const response=await thread.save();
        res.send(response);
    }
    catch(err){
        console.log(err);
        res.status(500).send("Error in creating thread");
    }
})*/

router.get("/threads",async(req,res)=>{
    try{
        const threads=await Thread.find().sort({updatedAt:-1});
        res.send(threads);
    }catch(err){
        console.log(err);
        res.status(500).send("Error in creating thread");
    }});

router.get("/thread/:id",async(req,res)=>{
    const id = String(req.params.id);
    //console.log("Fetching messages for thread ID:", id);
    try{
        // Use findOne by custom threadId (not findById)
        const thread = await Thread.findOne({ threadId: id });
        if(!thread){
            return res.status(404).send("Thread not found");
        }
        res.json(thread.messages);
    }catch(err){
        console.log(err);
        res.status(500).send("Error in creating thread");
    }});
    
router.delete("/thread/:id", async (req, res) => {
    const id = String(req.params.id);
    try {
        // delete by your custom threadId field (pass an object as the filter)
        const thread = await Thread.findOneAndDelete({ threadId: id });
        if (!thread) {
            return res.status(404).send("Thread not found");
        }
        res.json({ message: "Thread deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error in deleting thread");
    }
});

router.post("/chat", async (req, res) => {
    const { Id, message } = req.body;
    console.log("Received chat request:", req.body);
    if (!Id) {
        return res.status(400).json({ error: "Thread ID is required" });
    }
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }
    try {
        let thread = await Thread.findOne({ threadId: Id });
        if (!thread) {
            console.log("Thread not found, creating a new one");
            thread = new Thread({
                threadId: Id,
                title: message,
                messages: [{ role: "user", content: message }]
            });
        } else {
            console.log("Thread found, adding message to it");
            thread.messages.push({ role: "user", content: message });
        }
        const reply = await runchat(message);
        // ensure role spelled "assistant" to match frontend
        thread.messages.push({ role: "assistant", content: reply });
        thread.updatedAt = new Date();
        await thread.save();
        res.json({ reply: thread.messages });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error in chatting" });
    }
});
export default router;