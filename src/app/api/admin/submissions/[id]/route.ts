// app/api/admin/submissions/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { status } = await req.json();
  if (!["ACCEPTED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const submission = await prisma.submissions.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json(submission);
}
