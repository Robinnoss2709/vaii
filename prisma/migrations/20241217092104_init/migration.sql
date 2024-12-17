-- CreateTable
CREATE TABLE "ScheduleItem" (
    "id" SERIAL NOT NULL,
    "day" TEXT NOT NULL,
    "hour" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "teacher" TEXT NOT NULL,
    "classroom" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT 'bg-gray-400',
    "userId" TEXT NOT NULL,

    CONSTRAINT "ScheduleItem_pkey" PRIMARY KEY ("id")
);
