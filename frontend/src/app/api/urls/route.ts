import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch URLs for the user
    const urls = await prisma.url.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        _count: {
          select: {
            clicks: true,
          },
        },
        clicks: {
          take: 5,
          orderBy: {
            clickedAt: 'desc',
          },
          select: {
            clickedAt: true,
            ipAddress: true,
            country: true,
            device: true,
            browser: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // Get total count for pagination
    const totalCount = await prisma.url.count({
      where: {
        userId: session.user.id,
      },
    });

    // Transform the data for frontend
    const formattedUrls = urls.map(url => ({
      id: url.id,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      title: url.title,
      description: url.description,
      isActive: url.isActive,
      clickCount: url._count.clicks,
      createdAt: url.createdAt,
      lastClickAt: url.lastClickAt,
      recentClicks: url.clicks,
    }));

    return NextResponse.json({
      urls: formattedUrls,
      totalCount,
      hasMore: offset + limit < totalCount,
    });

  } catch (error) {
    console.error("Error fetching URLs:", error);
    return NextResponse.json(
      { error: "Failed to fetch URLs" },
      { status: 500 }
    );
  }
} 