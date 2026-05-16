import express from "express";
import Thread from "../models/thread.js";
import getOpenAIResponse from "../utils/openai.js";

const router = express.Router();


// TEST ROUTE
router.post("/test", async (req, res) => {

  try {

    const thread = new Thread({
      threadId: "xyz",
      title: "Testing New Thread",
    });

    const response = await thread.save();

    res.send(response);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Failed to save in DB",
    });

  }

});


// CHAT ROUTE
router.post("/chat", async (req, res) => {

  const { threadId, message } = req.body;

  // validation
  if (!threadId || !message) {

    return res.status(400).json({
      error: "missing required fields",
    });

  }

  try {

    let thread = await Thread.findOne({
      threadId,
    });

    // create new thread
    if (!thread) {

      thread = new Thread({
        threadId,
        title: message,

        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      });

    } else {

      // existing thread
      thread.messages.push({
        role: "user",
        content: message,
      });

    }

    // AI response
    const assistantReply = await getOpenAIResponse(message);

    // save assistant message
    thread.messages.push({
      role: "assistant",
      content: assistantReply,
    });

    thread.updatedAt = new Date();

    await thread.save();

    res.json({
      reply: assistantReply,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "something went wrong",
    });

  }

});


// GET ALL THREADS
router.get("/thread", async (req, res) => {

  try {

    const threads = await Thread.find({}).sort({
      updatedAt: -1,
    });

    res.json(threads);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Failed to fetch threads",
    });

  }

});


// GET SINGLE THREAD
router.get("/thread/:threadId", async (req, res) => {

  const { threadId } = req.params;

  try {

    const thread = await Thread.findOne({
      threadId,
    });

    if (!thread) {

      return res.status(404).json({
        error: "Thread not found",
      });

    }

    res.json(thread.messages);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Failed to fetch chat",
    });

  }

});


// DELETE THREAD
router.delete("/thread/:threadId", async (req, res) => {

  const { threadId } = req.params;

  try {

    const deletedThread = await Thread.findOneAndDelete({
      threadId,
    });

    if (!deletedThread) {

      return res.status(404).json({
        error: "Thread not found",
      });

    }

    res.status(200).json({
      success: "Thread deleted successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Failed to delete thread",
    });

  }

});

export default router;