import { NextResponse } from "next/server";
import connectDb from "../db/connectDb";
import Prompt from "../models/Prompt";
import User from "../models/User";

export async function POST(request) {
  try {
    await connectDb();

    const promptData = await request.json();
    const { image, title, content, walletAddress, price, category } = promptData;

    // Validate required fields with specific messages
    const missingFields = [];
    if (!image) missingFields.push("Image URL");
    if (!title) missingFields.push("Title");
    if (!content) missingFields.push("Content");
    if (!walletAddress) missingFields.push("Wallet Address");
    if (!price) missingFields.push("Price");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Find the user by wallet address
    const user = await User.findOne({ 
      walletAddress: walletAddress.toLowerCase() 
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please connect your wallet first." },
        { status: 404 }
      );
    }

    const newPrompt = new Prompt({
      image,
      title,
      content,
      owner: user._id, // Set the owner as the user's ObjectId
      price,
      category: category || "Other",
      rating: 3,
    });

    await newPrompt.save();

    // Populate the owner details in the response
    const populatedPrompt = await newPrompt.populate('owner', 'username walletAddress');

    return NextResponse.json(
      { 
        message: "Prompt created successfully", 
        prompt: populatedPrompt 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create prompt error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create prompt" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDb();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const walletAddress = searchParams.get("walletAddress");

    let query = {};

    if (category) {
      query.category = category;
    }

    if (walletAddress) {
      const user = await User.findOne({ 
        walletAddress: walletAddress.toLowerCase() 
      });
      if (user) {
        query.owner = user._id;
      }
    }

    const prompts = await Prompt.find(query)
      .populate("owner", "username walletAddress")
      .sort({ createdAt: -1 });

    return NextResponse.json(prompts);
  } catch (error) {
    console.error("Fetch prompts error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch prompts" },
      { status: 500 }
    );
  }
}
