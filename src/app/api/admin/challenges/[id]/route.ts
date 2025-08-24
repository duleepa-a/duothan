import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const challenge = await prisma.challenges.update({
    where: { id: params.id },
    data: { ...body },
  });
  return NextResponse.json(challenge);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.challenges.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}