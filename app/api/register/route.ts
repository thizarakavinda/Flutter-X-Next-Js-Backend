import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {

  const body = await req.json();

  const email = body.email;
  const password = body.password;

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.collection("users").add({
    email,
    password: hashedPassword,
    createdAt: new Date()
  });

  return NextResponse.json({
    message: "User registered successfully"
  });

}