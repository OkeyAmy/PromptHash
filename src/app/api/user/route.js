import { NextResponse } from "next/server";
import connectDb from "../db/connectDb";
import User from "../models/User";

export async function POST(request) {
  try {
    await connectDb();

    const { walletAddress, username } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      walletAddress: walletAddress.toLowerCase(),
    });

    if (existingUser) {
      console.log("User already exists:", existingUser);
      return NextResponse.json(
        {
          message: "Login successful",
        },
        { status: 200 }
      );
    }

    // Generate random username if not provided
    const generatedUsername =
      username || `user${Math.floor(100000 + Math.random() * 900000)}`;

    // Create new user if doesn't exist
    const newUser = new User({
      walletAddress: walletAddress.toLowerCase(),
      username: generatedUsername,
      rating: 4,
    });
    await newUser.save();

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register user" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDb();

    // Get wallet address from search params if provided
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");

    let users;

    if (walletAddress) {
      users = await User.findOne({
        walletAddress: walletAddress.toLowerCase(),
      });

      if (!users) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    } else {
      users = await User.find({});
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}
