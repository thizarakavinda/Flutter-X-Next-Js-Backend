import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {

  const body = await req.json();

  const email = body.email;
  const password = body.password;

  const snapshot = await db
    .collection("users")
    .where("email", "==", email)
    .get();

  if (snapshot.empty) {

    return NextResponse.json(
      { message: "User not found" },
      { status: 401 }
    );

  }

  const user = snapshot.docs[0].data();

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {

    return NextResponse.json(
      { message: "Invalid password" },
      { status: 401 }
    );

  }

  const token = jwt.sign(
    { email },
    "SECRET_KEY",
    { expiresIn: "1d" }
  );

  return NextResponse.json({ token });

}