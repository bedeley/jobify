"use server";

import prisma from "./db";

import {
  JobType,
  CreateAndEditJobType,
  createAndEditJobSchema,
  JobMode,
  JobStatus,
} from "./types";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { auth } from "@clerk/nextjs/server";

const authenticateAndRedirect = async (): Promise<string> => {
  const { userId } = await auth();
 
  
  if (!userId) redirect("/");

  return userId;
};

export const createJobAction = async (
  values: CreateAndEditJobType
): Promise<JobType | null> => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const userId = await authenticateAndRedirect();

  try {
    createAndEditJobSchema.parse(values);

    const job: JobType = await prisma.job.create({
      data: {
        ...values,
        clerkId: userId,
      },
    });
    return job;
  } catch (error) {
    console.log(error);
    return null;
  }
};

type GetAllJobsActionType = {
  search?: string;
  jobStatus?: string;
  page?: number;
  limit?: number;
};

export const getAllJobsAction = async ({
  search,
  jobStatus,
  page = 1,
  limit = 10,
}: GetAllJobsActionType): Promise<{
  jobs: JobType[];
  count: number;
  page: number;
  totalPages: number;
}> => {
  const userId = await authenticateAndRedirect();

  try {
    let whereClause: Prisma.JobWhereInput = {
      clerkId: userId,
    };
    if (search) {
      whereClause = {
        ...whereClause,
        OR: [
          {
            position: {
              contains: search,
            },
          },
          {
            company: {
              contains: search,
            },
          },
        ],
      };
    }

    if (jobStatus && jobStatus !== "all") {
      whereClause = {
        ...whereClause,
        status: jobStatus,
      };
    }

    const skip = (page-1) * limit

    const jobs: JobType[] = await prisma.job.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
    const count:number = await prisma.job.count({
      where: whereClause
    })

    const totalPages = Math.ceil(count/limit)
    return { jobs, count, page, totalPages };
  } catch (error) {
    return { jobs: [], count: 0, page: 1, totalPages: 0 };
  }
};

export async function deleteJobAction(id: string): Promise<JobType | null> {
  const userId = await authenticateAndRedirect();

  try {
    const job: JobType = await prisma.job.delete({
      where: {
        id,
        clerkId: userId,
      },
    });
    return job;
  } catch (error) {
    return null;
  }
}

export const getSingleJobAction = async ({
  id,
}: {
  id: string;
}): Promise<JobType | null> => {
  const userId = await authenticateAndRedirect();

  try {
    const job: JobType | null = await prisma.job.findUnique({
      where: {
        id,
        clerkId: userId,
      },
    });
    if (!job) {
      redirect("/job");
    }
       
    return job;
  } catch (error) {
    return null;
  }
};

export const updateJobAction = async ({
  id,
  values,
}: {
  id: string;
  values: CreateAndEditJobType;
}): Promise<JobType | null> => {
  const userId = await authenticateAndRedirect();

  try {
    const job: JobType | null = await prisma.job.update({
      where: {
        id,
        clerkId: userId,
      },
      data: { ...values },
    });
    return job;
  } catch (error) {
    return null;
  }
};

export async function getStatsAction(): Promise<{
  pending: number;
  interview: number;
  declined: number;
}> {
  const userId = authenticateAndRedirect();
  // just to show Skeleton
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  try {
    const stats = await prisma.job.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
      where: {
        clerkId: "user_2zeU1jsmgXI1VepyxIKUClGQWPI", // replace userId with the actual clerkId
      },
    });
    const statsObject = stats.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);

    const defaultStats = {
      pending: 0,
      declined: 0,
      interview: 0,
      ...statsObject,
    };
    return defaultStats;
    
  } catch (error) {
    redirect("/jobs");
  }
}


export async function getChartsDataAction(): Promise<
  Array<{ date: string; count: number }>
> {
  const userId = authenticateAndRedirect();
  const sixMonthsAgo = dayjs().subtract(6, "month").toDate();
  try {
    const jobs = await prisma.job.findMany({
      where: {
        clerkId: "user_2zeU1jsmgXI1VepyxIKUClGQWPI",
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
        

    let applicationsPerMonth = jobs.reduce((acc, job) => {
      const date = dayjs(job.createdAt).format("MMM YY");

      const existingEntry = acc.find((entry) => entry.date === date);

      if (existingEntry) {
        existingEntry.count += 1;
      } else {
        acc.push({ date, count: 1 });
      }

      return acc;
    }, [] as Array<{ date: string; count: number }>);

    return applicationsPerMonth;
  } catch (error) {
    redirect("/jobs");
  }
}
