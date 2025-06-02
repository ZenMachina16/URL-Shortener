import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Date range for analytics
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get user's URLs
    const userUrls = await prisma.url.findMany({
      where: { userId: session.user.id },
      select: { id: true },
    });

    const urlIds = userUrls.map(url => url.id);

    if (urlIds.length === 0) {
      return NextResponse.json({
        totalUrls: 0,
        totalClicks: 0,
        clicksThisPeriod: 0,
        topCountries: [],
        topDevices: [],
        clicksByDay: [],
        recentClicks: [],
      });
    }

    // Total stats
    const [totalUrls, totalClicks, clicksThisPeriod] = await Promise.all([
      prisma.url.count({
        where: { userId: session.user.id },
      }),
      prisma.urlClick.count({
        where: { urlId: { in: urlIds } },
      }),
      prisma.urlClick.count({
        where: {
          urlId: { in: urlIds },
          clickedAt: { gte: startDate },
        },
      }),
    ]);

    // Top countries
    const topCountries = await prisma.urlClick.groupBy({
      by: ['country'],
      where: {
        urlId: { in: urlIds },
        clickedAt: { gte: startDate },
        country: { not: null },
      },
      _count: { country: true },
      orderBy: { _count: { country: 'desc' } },
      take: 5,
    });

    // Top devices
    const topDevices = await prisma.urlClick.groupBy({
      by: ['device'],
      where: {
        urlId: { in: urlIds },
        clickedAt: { gte: startDate },
        device: { not: null },
      },
      _count: { device: true },
      orderBy: { _count: { device: 'desc' } },
      take: 5,
    });

    // Clicks by day (last 7 days)
    const clicksByDay = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const count = await prisma.urlClick.count({
        where: {
          urlId: { in: urlIds },
          clickedAt: {
            gte: date,
            lt: nextDate,
          },
        },
      });
      
      clicksByDay.push({
        date: date.toISOString().split('T')[0],
        clicks: count,
      });
    }

    // Recent clicks
    const recentClicks = await prisma.urlClick.findMany({
      where: {
        urlId: { in: urlIds },
      },
      include: {
        url: {
          select: {
            shortCode: true,
            originalUrl: true,
          },
        },
      },
      orderBy: {
        clickedAt: 'desc',
      },
      take: 10,
    });

    return NextResponse.json({
      totalUrls,
      totalClicks,
      clicksThisPeriod,
      topCountries: topCountries.map(item => ({
        country: item.country,
        count: item._count.country,
      })),
      topDevices: topDevices.map(item => ({
        device: item.device,
        count: item._count.device,
      })),
      clicksByDay,
      recentClicks: recentClicks.map(click => ({
        id: click.id,
        shortCode: click.url.shortCode,
        originalUrl: click.url.originalUrl,
        clickedAt: click.clickedAt,
        country: click.country,
        device: click.device,
        browser: click.browser,
      })),
    });

  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
} 